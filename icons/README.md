# Clean Minimal Line Icons

Modern, minimal line icons converted from emojis. Designed in a uniform style similar to Feather Icons and Heroicons.

## Features

- **Consistent Design**: 2px stroke weight, 24x24 viewBox
- **No Gradients**: Clean line-based design
- **Scalable**: SVG format for perfect scaling
- **Modern Style**: Suitable for website navigation and UI
- **Customizable**: Uses `currentColor` for easy theming

## Icon List

| Emoji | Icon Name | File | Usage |
|-------|-----------|------|-------|
| ✅ | Check | `check.svg` | Success, completion, verified |
| 🎉 | Celebration | `celebration.svg` | Party, success, achievement |
| 🚀 | Rocket | `rocket.svg` | Launch, speed, growth |
| 📊 | Chart | `chart.svg` | Analytics, data, statistics |
| 🔑 | Key | `key.svg` | Security, access, credentials |
| 🎯 | Target | `target.svg` | Goal, focus, objective |
| 🛡️ | Shield | `shield.svg` | Security, protection, safety |
| 📈 | Trending Up | `trending-up.svg` | Growth, performance, increase |
| 🧪 | Test | `test.svg` | Testing, experiment, lab |
| 📚 | Books | `books.svg` | Documentation, resources, learning |
| 🐛 | Bug | `bug.svg` | Error, debugging, issue |
| 🎊 | Confetti | `confetti.svg` | Celebration, success, party |
| 💡 | Lightbulb | `lightbulb.svg` | Idea, innovation, tip |
| 🔴 | Alert Circle | `alert-circle.svg` | Warning, error, attention |
| 🔄 | Refresh | `refresh.svg` | Reload, update, sync |
| ⚡ | Zap | `zap.svg` | Electric, power, energy |

## Usage

### Direct SVG

```html
<img src="./icons/check.svg" alt="Check" width="24" height="24">
```

### Inline SVG

```html
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"></polyline>
</svg>
```

### React Component

```tsx
import Icon from './icons/Icon';

function MyComponent() {
  return (
    <div>
      <Icon name="check" size={24} color="#10b981" />
      <Icon name="rocket" size={32} />
      <Icon name="zap" className="text-blue-500" />
    </div>
  );
}
```

### CSS Styling

```css
.icon {
  width: 24px;
  height: 24px;
  stroke: currentColor;
}

.icon-success {
  stroke: #10b981;
}

.icon-error {
  stroke: #ef4444;
}

.icon-warning {
  stroke: #f59e0b;
}
```

## Customization

All icons use:
- **Stroke**: `currentColor` (inherits text color)
- **Stroke Width**: `2px`
- **Fill**: `none`
- **ViewBox**: `0 0 24 24`

You can customize:
- **Size**: Change `width` and `height` attributes
- **Color**: Set `stroke` attribute or use CSS `color`
- **Stroke Width**: Adjust `stroke-width` for thicker/thinner lines

## Examples

### Different Sizes
```html
<img src="./icons/rocket.svg" width="16" height="16"> <!-- Small -->
<img src="./icons/rocket.svg" width="24" height="24"> <!-- Default -->
<img src="./icons/rocket.svg" width="48" height="48"> <!-- Large -->
```

### Different Colors
```html
<svg style="stroke: #3b82f6;">...</svg> <!-- Blue -->
<svg style="stroke: #10b981;">...</svg> <!-- Green -->
<svg style="stroke: #ef4444;">...</svg> <!-- Red -->
```

### With Tailwind CSS
```html
<Icon name="check" className="w-6 h-6 text-green-500" />
<Icon name="alert-circle" className="w-8 h-8 text-red-600" />
<Icon name="lightbulb" className="w-5 h-5 text-yellow-500" />
```

## Files Included

- **Individual SVG files**: `icons/*.svg` (16 files)
- **Combined SVG sprite**: `icons.svg` (all icons in one file)
- **React Component**: `icons/Icon.tsx` (TypeScript React component)
- **Documentation**: `icons/README.md` (this file)

## License

These icons are custom-designed for your project. Feel free to use and modify them as needed.
