# Numbers Omni agent shell resource limits.
# This file is generated; edit backend settings instead.
if [ "${OMNI_AGENT_SHELL_LIMITS_APPLIED:-}" != "1" ]; then
  export OMNI_AGENT_SHELL_LIMITS_APPLIED=1
  ulimit -t 1800 2>/dev/null || true
  ulimit -f 2097152 2>/dev/null || true
fi
