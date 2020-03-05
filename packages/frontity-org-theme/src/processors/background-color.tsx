import React from "react";
import { css } from "frontity";
import { Processor } from "@frontity/html2react/types";
import FrontityOrg from "../../types";

const colorClassRegex = /has-([\w-]+)-background-color/;
const opacityClassRegex = /has-background-opacity-(\d+)/;

const backgroundColor: Processor<React.HTMLProps<HTMLElement>, FrontityOrg> = {
  name: "backgroundColor",
  test: ({ node }) =>
    node.type === "element" &&
    node.props.className &&
    node.props.className.split(" ").includes("has-background"),
  processor: ({ node, state, libraries }) => {
    if (node.type === "element") {
      // Get the class with the color name.
      const colorClass = node.props.className
        .split(" ")
        .find(name => colorClassRegex.test(name));

      // Get the color name from that class.
      if (colorClass) {
        // Color code.
        let color: string;

        // Get the color name from that class.
        const [, colorName] = colorClass.match(colorClassRegex);

        // Get the opacity class if exists.
        const opacityClass = node.props.className
          .split(" ")
          .find(name => opacityClassRegex.test(name));

        if (opacityClass) {
          // Get the value from the opacity class.
          const [, opacityValue] = opacityClass.match(opacityClassRegex);

          // Assign color value with the opacity.
          color = libraries.theme.addAlpha(
            state.theme.colors[colorName],
            Number(opacityValue) / 100
          );
        } else {
          // Get the color code from state.
          color = state.theme.colors[colorName];
        }

        // Replace the `css` prop with a new one with `background-color`.
        node.props.css = css`
          ${node.props.css}
          background-color: ${color};
        `;
      }
    }

    return node;
  }
};

export default backgroundColor;
