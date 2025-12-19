import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CAPTURE_TOKEN = Deno.env.get('CAPTURE_TOKEN');
    if (!CAPTURE_TOKEN) {
      console.error('CAPTURE_TOKEN is not configured');
      throw new Error('CAPTURE_TOKEN is not configured');
    }

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) {
      console.error('User verification failed:', userError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Processing request for user:', user.id);

    // Get the form data with the image file
    const formData = await req.formData();
    const imageFile = formData.get('file') as File;
    
    if (!imageFile) {
      return new Response(JSON.stringify({ error: 'No image file provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Received file:', imageFile.name, 'Type:', imageFile.type, 'Size:', imageFile.size);

    // Read the file content
    const arrayBuffer = await imageFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Calculate SHA-256 hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', uint8Array);
    const proofHash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    console.log('Calculated proof hash:', proofHash);

    // Create integrity proof
    const integrityProof = {
      proof_hash: proofHash,
      asset_mime_type: imageFile.type,
      created_at: Date.now()
    };

    // Upload to blog-images bucket first
    const fileName = `${user.id}/${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabaseClient.storage
      .from('blog-images')
      .upload(fileName, uint8Array, {
        contentType: imageFile.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Failed to upload to storage: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from('blog-images')
      .getPublicUrl(fileName);
    
    const imageUrl = urlData.publicUrl;
    console.log('Uploaded to storage, public URL:', imageUrl);

    // Register with Numbers Protocol API
    const captureFormData = new FormData();
    captureFormData.append('asset_file', new Blob([uint8Array], { type: imageFile.type }), imageFile.name);
    captureFormData.append('signed_metadata', JSON.stringify(integrityProof));

    console.log('Calling Numbers Protocol API...');
    const captureResponse = await fetch('https://api.numbersprotocol.io/api/v3/assets/', {
      method: 'POST',
      headers: {
        'Authorization': `token ${CAPTURE_TOKEN}`,
      },
      body: captureFormData
    });

    if (!captureResponse.ok) {
      const errorText = await captureResponse.text();
      console.error('Numbers Protocol API error:', captureResponse.status, errorText);
      throw new Error(`Numbers Protocol API error: ${captureResponse.status} - ${errorText}`);
    }

    const captureData = await captureResponse.json();
    const nid = captureData.id;
    console.log('Registered with Numbers Protocol, NID:', nid);

    // Save to capture_images table
    const { error: dbError } = await supabaseClient
      .from('capture_images')
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        nid: nid,
        file_name: imageFile.name,
        mime_type: imageFile.type
      });

    if (dbError) {
      console.error('Database insert error:', dbError);
      // Don't throw, we still have the URL and NID
    }

    console.log('Successfully processed image');

    return new Response(JSON.stringify({ 
      url: imageUrl, 
      nid: nid,
      fileName: imageFile.name 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in register-capture-image:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
