#!/usr/bin/env sh

# Replaces environment variables in the bundle's index.html file with their respective values.
# This script is automatically picked up by the nginx entrypoint on startup.

set -e

INDEX_BUNDLE_PATH="/app/dashboard/index.html"

# Function to replace environment variables
replace_env_var() {
  var_name=$1
  var_value=$(eval echo \$$var_name)
  if [ -n "$var_value" ]; then
    echo "Setting $var_name to: $var_value"
    sed -i "s#$var_name:.*#$var_name: \"$var_value\",#" "$INDEX_BUNDLE_PATH"
  else
    echo "No $var_name provided, using defaults."
  fi
}

# Replace each environment variable
replace_env_var "APP_MOUNT_URI"
replace_env_var "APPS_MARKETPLACE_API_URL"
replace_env_var "APPS_TUNNEL_URL_KEYWORDS"
replace_env_var "STATIC_URL"
replace_env_var "API_URL"

echo "Environment variable replacement complete."
