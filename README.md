# VSCode Deepseek Daddy Extension

A Visual Studio Code extension that integrates Deepseek's AI model directly into your editor, providing a convenient chat interface for AI assistance.

## Features

- 🤖 Direct integration with Deepseek AI model
- 💬 Interactive chat interface within VSCode
- ⚡ Real-time streaming responses
- 🎨 Clean and simple UI

## Prerequisites

Before installing this extension, make sure you have:

1. [Ollama](https://ollama.ai/) installed on your system
2. The Deepseek model pulled in Ollama (`ollama pull deepseek-r1:latest`)

## Installation

1. Download the VSIX file from the releases page
2. Install it in VSCode:
   - Open VSCode
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Type "Install from VSIX"
   - Select the downloaded file

Alternatively, you can install it directly from the VSCode Marketplace (once published).

## Usage

1. Open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Deepseek Chat" or select "vsode-deepseek-daddy.chat"
3. A chat interface will open in a new panel
4. Type your question or prompt in the textarea
5. Click "Ask" or press Enter to get a response

## Commands

- `vsode-deepseek-daddy.chat`: Opens the Deepseek chat interface

## Configuration

Currently, the extension uses default settings for the Deepseek model. Future versions may include customizable settings for:
- Temperature
- Max tokens
- Model selection
- Other Ollama parameters

## Development

To build and run this extension locally:

1. Clone the repository
```bash
git clone [repository-url]
cd vscode-deepseek-daddy
```

2. Install dependencies
```bash
npm install
```

3. Open the project in VSCode
```bash
code .
```

4. Press F5 to start debugging

### Building

To create a VSIX package:
```bash
npm run package
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)

## Credits

This extension uses:
- [Ollama](https://ollama.ai/) for model integration
- [Deepseek](https://deepseek.ai/) AI model

## Troubleshooting

Common issues:

1. **"Connection refused" error**
   - Make sure Ollama is running on your system
   - Verify that you have pulled the Deepseek model

2. **No response from chat**
   - Check your system's console for error messages
   - Ensure you have a stable internet connection

## Support

For issues and feature requests, please open an issue on the GitHub repository.