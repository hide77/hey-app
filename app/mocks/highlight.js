import React from "react";
import { Text } from "react-native";

var customComponents = {
  b: {
    fontWeight: "bold"
  }
};

function highlight(text, key) {
  text = text.split(/(<.*?>.*?<\/.*?>)/g);
  for (var i = 1; i < text.length; i += 2) {
    var word = text[i].replace(/<.*?>(.*?)<\/.*?>/, "$1");
    text[i] = <Text key={key ? key : Math.random().toString()} style={customComponents[text[i][1]]}>{word}</Text>;
  }
  return text;
}

export default text => highlight(text);
