# Logo Folder

Upload your logo files here. Supported formats:
- .svg (recommended - scalable)
- .png (transparent background preferred)
- .jpg / .jpeg
- .webp

The app currently imports the logo in JavaScript (see [src/main.js](../../src/main.js)):
`import logoImage from '../public/logo/PRJ1.png?url'`

If you prefer to reference the logo directly in HTML, you can use:
`<img src="/logo/your-logo-name.svg" alt="PRJ1 Logo" />`
