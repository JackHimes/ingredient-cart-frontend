// NextUI renders Select options in a portal on <body>, outside the page's text color. In OS dark mode
// globals.css makes body text white, so the options were white-on-white until hovered. Set the colors explicitly.
export const dropdownClassNames = {
  popoverContent: "bg-off-white text-green-text",
};
