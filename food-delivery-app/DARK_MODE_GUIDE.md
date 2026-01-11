# 🌓 Dark Mode & Light Mode Implementation Guide

## Overview
This document provides a comprehensive guide to the dark mode and light mode implementation for the React website using Tailwind CSS.

## 🎨 Color Scheme

### Light Mode (Default)
- **Background**: Pure white (#ffffff)
- **Text Primary**: Dark gray (#2d3748)
- **Text Secondary**: Medium gray (#4a5568)
- **Card Background**: White (#ffffff)
- **Borders**: Light gray (#e2e8f0)

### Dark Mode (Eye-Friendly)
- **Background**: Pure black (#000000)
- **Text Primary**: Light gray (#f0f0f0)
- **Text Secondary**: Medium gray (#b8b8b8)
- **Card Background**: Dark gray (#1a1a1a)
- **Borders**: Dark gray (#2a2a2a)

### Brand Colors (Both Modes)
- **Primary Orange**: #ff8c42 (light) / #ff9d5c (dark - slightly muted)
- **Primary Green**: #4caf50 (light) / #5ec962 (dark - slightly muted)

## 🔧 Implementation

### 1. CSS Variables (`app/globals.css`)

The implementation uses CSS custom properties for easy theme switching:

```css
:root {
  /* Light mode variables */
  --background: #ffffff;
  --foreground: #1a202c;
  --primary-orange: #ff8c42;
  --primary-green: #4caf50;
  /* ... more variables */
}

.dark {
  /* Dark mode variables */
  --background: #000000;
  --foreground: #e8e8e8;
  --primary-orange: #ff9d5c;
  --primary-green: #5ec962;
  /* ... more variables */
}
```

### 2. Theme Context (`context/ThemeContext.tsx`)

The ThemeContext provides:
- `theme`: Current theme ('light' or 'dark')
- `toggleTheme()`: Function to switch themes
- `isDark`: Boolean indicating if dark mode is active

```typescript
const { theme, toggleTheme, isDark } = useTheme();
```

### 3. Theme Toggle Button

Located in the Header component with animated icons:

```jsx
<button onClick={toggleTheme}>
  {isDark ? (
    <svg>/* Sun icon */</svg>
  ) : (
    <svg>/* Moon icon */</svg>
  )}
</button>
```

## 🎯 Component Styling Guide

### Navbar (Header Component)

**Light Mode:**
- Background: White
- Text: Dark gray (#2d3748)
- Border: Light gray (#e2e8f0)

**Dark Mode:**
- Background: Dark gray (#1a1a1a)
- Text: Light gray (#e8e8e8)
- Border: Dark gray (#2a2a2a)

**Example:**
```jsx
<header className="bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-[#2a2a2a]">
```

### Navigation Links

```jsx
<Link className="text-gray-700 dark:text-gray-300 hover:text-[var(--primary-orange)] dark:hover:text-[var(--primary-orange)]">
```

### Buttons

**Primary Button:**
```jsx
<button className="bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-hover)] text-white">
```

**Secondary Button:**
```jsx
<button className="bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-green-hover)] text-white">
```

**Ghost Button:**
```jsx
<button className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
```

### Cards

```jsx
<div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a]">
```

### Dropdowns/Modals

```jsx
<div className="bg-white dark:bg-[#1a1a1a] shadow-xl dark:shadow-2xl border border-gray-200 dark:border-[#2a2a2a]">
```

### Text Elements

**Headings:**
```jsx
<h1 className="text-gray-900 dark:text-gray-100">
```

**Body Text:**
```jsx
<p className="text-gray-700 dark:text-gray-300">
```

**Muted Text:**
```jsx
<span className="text-gray-500 dark:text-gray-400">
```

### Backgrounds

**Page Background:**
```jsx
<div className="bg-white dark:bg-black">
```

**Section Background:**
```jsx
<section className="bg-gray-50 dark:bg-[#0a0a0a]">
```

## 🎨 Utility Classes

Pre-defined utility classes in `globals.css`:

### Card
```jsx
<div className="card-light">
  /* Auto-applies background, border, and hover effects */
</div>
```

### Buttons
```jsx
<button className="btn-primary">Primary Action</button>
<button className="btn-secondary">Secondary Action</button>
```

## 🌟 Best Practices

### 1. Always Use Both Light and Dark Classes
```jsx
// ✅ Good
<div className="bg-white dark:bg-black text-gray-900 dark:text-gray-100">

// ❌ Bad
<div className="bg-white text-gray-900">
```

### 2. Use CSS Variables for Brand Colors
```jsx
// ✅ Good
<button className="bg-[var(--primary-orange)]">

// ❌ Bad
<button className="bg-orange-500">
```

### 3. Add Transitions for Smooth Theme Switching
```jsx
<div className="transition-colors duration-300">
```

### 4. Test Both Modes
Always test your components in both light and dark modes to ensure readability.

### 5. Use Appropriate Contrast
- Light mode: Dark text on light background
- Dark mode: Light text on dark background
- Ensure WCAG AA compliance (4.5:1 contrast ratio)

## 🔄 Animations

### Smooth Transitions
All theme-related changes include smooth transitions:
```css
transition: background-color 0.3s ease, color 0.3s ease;
```

### Icon Animations
Theme toggle icons have rotation animations:
```jsx
<svg className="group-hover:rotate-180 transition-transform duration-500">
```

## 📱 Mobile Considerations

The mobile menu also supports dark mode:
```jsx
<div className="bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-[#2a2a2a]">
```

## 🎯 Accessibility

### Focus States
```jsx
<button className="focus:ring-2 focus:ring-[var(--primary-orange)] focus:ring-offset-2 dark:focus:ring-offset-black">
```

### Screen Reader Support
The theme toggle button includes proper ARIA labels:
```jsx
<button title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
```

## 💾 Persistence

Theme preference is saved to localStorage:
```typescript
localStorage.setItem('theme', newTheme);
```

And loaded on mount:
```typescript
const savedTheme = localStorage.getItem('theme');
```

## 🐛 Troubleshooting

### Issue: Flash of Unstyled Content (FOUC)
**Solution**: The ThemeProvider loads the theme from localStorage before rendering children.

### Issue: Colors Not Changing
**Solution**: Ensure you're using both light and dark classes, not just one.

### Issue: Navbar Not Updating
**Solution**: Check that the Header component is wrapped by the ThemeProvider.

## 📚 Component Checklist

When creating new components, ensure:
- [ ] Background colors defined for both modes
- [ ] Text colors defined for both modes
- [ ] Border colors defined for both modes
- [ ] Hover states work in both modes
- [ ] Focus states visible in both modes
- [ ] Transitions added for smooth switching
- [ ] Tested in both light and dark modes

## 🎨 Color Reference Quick Guide

### Backgrounds
- Page: `bg-white dark:bg-black`
- Card: `bg-white dark:bg-[#1a1a1a]`
- Section: `bg-gray-50 dark:bg-[#0a0a0a]`
- Hover: `hover:bg-gray-100 dark:hover:bg-gray-800`

### Text
- Primary: `text-gray-900 dark:text-gray-100`
- Secondary: `text-gray-700 dark:text-gray-300`
- Muted: `text-gray-500 dark:text-gray-400`

### Borders
- Default: `border-gray-200 dark:border-[#2a2a2a]`
- Light: `border-gray-100 dark:border-[#1a1a1a]`

### Shadows
- Small: `shadow-sm dark:shadow-gray-900/50`
- Medium: `shadow-md dark:shadow-xl`
- Large: `shadow-lg dark:shadow-2xl`

## 🚀 Future Enhancements

Potential improvements:
1. System preference detection (prefers-color-scheme)
2. Multiple theme options (not just light/dark)
3. Custom color picker for users
4. Per-component theme overrides
5. Animated theme transitions

---

**Last Updated**: January 2026
**Version**: 1.0.0
