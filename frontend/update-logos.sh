#!/bin/bash

# Copy the new SVG logo to the main public directory
cp public/images/new/logo.svg public/logo.svg

# Make sure the favicon.svg is in place
if [ ! -f public/favicon.svg ]; then
  echo "Error: favicon.svg is missing!"
  exit 1
fi

echo "Logo files updated successfully!"
echo "The application now uses the new stylish 'SW' logo design."
