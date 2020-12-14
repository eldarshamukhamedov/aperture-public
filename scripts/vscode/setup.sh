mkdir -p ./.vscode
if [ -e ./.vscode/settings.json ]
then
  echo "Found existing VS Code project configuration. Skipping."
else
  echo "Writing VS Code project configuration.";
  cp ./scripts/vscode/settings.json ./.vscode/settings.json
  echo "Done."
fi
