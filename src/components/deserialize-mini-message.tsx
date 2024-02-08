import React from "react";

const colorMap: { [key: string]: string } = {
  black: "#000000",
  dark_blue: "#0000AA",
  dark_green: "#00AA00",
  dark_aqua: "#00AAAA",
  dark_red: "#AA0000",
  dark_purple: "#AA00AA",
  gold: "#FFAA00",
  gray: "#AAAAAA",
  dark_gray: "#555555",
  blue: "#5555FF",
  green: "#55FF55",
  aqua: "#55FFFF",
  red: "#FF5555",
  light_purple: "#FF55FF",
  yellow: "#FFFF55",
  white: "#FFFFFF",
};

const styleMap: { [key: string]: React.CSSProperties } = {
  obfuscated: { textShadow: "0 0 3px rgba(0, 0, 0, 0.5)" },
  bold: { fontWeight: "bold" },
  strikethrough: { textDecoration: "line-through" },
  underline: { textDecoration: "underline" },
  italic: { fontStyle: "italic" },
};

const findClosingTagIndex = (
  message: string,
  tagName: string,
  startIndex: number
): number => {
  const closingTag = `</${tagName}>`;
  let openTagCount = 1;

  for (let i = startIndex; i < message.length; i++) {
    if (message.startsWith(`<${tagName}>`, i)) {
      openTagCount++;
    } else if (message.startsWith(closingTag, i)) {
      openTagCount--;
      if (openTagCount === 0) {
        return i;
      }
    }
  }

  return -1;
};

const deserializeMiniMessage = (message: string) => {
  const regex = /<((?:\/)?\w+)(?::([\w-]+))?>/g;

  let lastIndex = 0;
  const elements: JSX.Element[] = [];

  let match;
  while ((match = regex.exec(message)) !== null) {
    if (match.index > lastIndex) {
      elements.push(
        <React.Fragment key={lastIndex}>
          {message.slice(lastIndex, match.index)}
        </React.Fragment>
      );
    }

    const tagName = match[1];
    const className = match[2] || tagName;
    const isClosingTag = tagName.startsWith("/");

    if (isClosingTag) {
      // Ignore closing tags
    } else if (colorMap[tagName] || styleMap[tagName]) {
      const style: React.CSSProperties = {};

      if (colorMap[tagName]) {
        style.color = colorMap[tagName];
      }

      if (styleMap[tagName]) {
        Object.assign(style, styleMap[tagName]);
      }

      const closingTagIndex = findClosingTagIndex(
        message,
        tagName,
        regex.lastIndex
      );
      const content =
        closingTagIndex === -1
          ? message.slice(regex.lastIndex)
          : message.slice(regex.lastIndex, closingTagIndex);

      elements.push(
        <span key={match.index} style={style}>
          {deserializeMiniMessage(content)}
        </span>
      );

      if (closingTagIndex !== -1) {
        regex.lastIndex = closingTagIndex + tagName.length + 3;
      } else {
        regex.lastIndex = message.length;
      }
    } else {
      elements.push(
        <React.Fragment key={match.index}>{match[0]}</React.Fragment>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < message.length) {
    elements.push(
      <React.Fragment key={lastIndex}>
        {message.slice(lastIndex)}
      </React.Fragment>
    );
  }

  return <>{elements}</>;
};

export default deserializeMiniMessage;
