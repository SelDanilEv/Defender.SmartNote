#!/bin/sh

cat <<EOF > /usr/share/nginx/html/config.js
window.config = {
  VUE_APP_API_URL: "$VUE_APP_API_URL"
};
EOF

echo $VUE_APP_API_URL

nginx -g "daemon off;"
