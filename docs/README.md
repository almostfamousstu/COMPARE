# SKU Specification Comparator - Documentation

Welcome to the comprehensive documentation for the SKU Specification Comparator application.

## Accessing the Documentation

### Local Access

To view the documentation locally:

1. Navigate to the `docs` directory
2. Open `index.html` in your web browser
3. Or use a local web server:

```bash
# Using Python 3
cd docs
python3 -m http.server 8080

# Using Node.js (http-server)
npx http-server docs -p 8080

# Then open http://localhost:8080 in your browser
```

### Features

The documentation includes:

- **🔍 Search Functionality**: Quickly find topics using the search box
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices
- **🌙 Dark Mode Interface**: Eye-friendly design matching the application
- **📚 Organized Navigation**: Sections for Getting Started, User Guide, Deployment, and Technical Reference
- **🔗 Cross-linked Pages**: Easy navigation between related topics

## Documentation Structure

### Getting Started
- **Home**: Overview and introduction
- **Installation Guide**: Step-by-step setup instructions
- **Quick Start**: Your first comparison walkthrough

### User Guide
- **Using the Application**: Comprehensive interface guide
- **Features & Tools**: All built-in functionality
- **Input Formats**: Supported data formats
- **Understanding Comparisons**: How comparison logic works

### Deployment
- **CLI & Scripts**: Command-line options and npm scripts
- **Docker Deployment**: Containerized deployment guide
- **Environment Configuration**: Environment variable setup

### Technical Reference
- **API Reference**: Complete API documentation
- **Architecture Overview**: System design and patterns
- **Component Reference**: React component documentation

### Help
- **Troubleshooting**: Solutions to common problems
- **FAQ**: Frequently asked questions

## Quick Links

Start here based on your needs:

- **New User?** → [Installation Guide](installation.html) → [Quick Start](quick-start.html)
- **Need Help?** → [Troubleshooting](troubleshooting.html) → [FAQ](faq.html)
- **Developer?** → [Architecture](architecture.html) → [Components](components.html) → [API Reference](api.html)
- **Deploying?** → [CLI Options](cli-options.html) → [Docker](docker.html) → [Environment](environment.html)

## Contributing to Documentation

The documentation is built with:
- HTML5 for structure
- CSS3 for styling
- Vanilla JavaScript for search functionality
- No build process required

To update documentation:
1. Edit the relevant HTML files in the `docs` directory
2. Maintain consistent styling using `styles.css`
3. Update search index in `index.html` if adding new pages
4. Test locally before committing

## Documentation Files

```
docs/
├── index.html              # Main entry point with navigation
├── styles.css              # Shared styles
├── home.html               # Documentation home
├── installation.html       # Installation guide
├── quick-start.html        # Quick start tutorial
├── usage.html              # Application usage guide
├── features.html           # Features and tools
├── input-formats.html      # Input format reference
├── comparison.html         # Comparison logic explanation
├── cli-options.html        # CLI and scripts reference
├── docker.html             # Docker deployment
├── environment.html        # Environment configuration
├── api.html                # API reference
├── architecture.html       # Architecture overview
├── components.html         # Component reference
├── troubleshooting.html    # Troubleshooting guide
├── faq.html                # FAQ
└── README.md               # This file
```

## Design Principles

- **User-focused**: Written for end users, not just developers
- **Comprehensive**: Covers every user-facing feature
- **Searchable**: Built-in search for quick topic discovery
- **Accessible**: High contrast, semantic HTML, keyboard navigation
- **Consistent**: Uniform styling and structure across all pages

## License

This documentation is part of the SKU Specification Comparator project.
