const asciiSum = str => {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum;
};

const colors = [
  ['#FF447A', '#FF7DB4', '#D860D3', '#1FBFFF'],
  ['#6659FF', '#5B7DFA', '#A463FD', '#78C8FF'],
  ['#5EECB3', '#85FFC4', '#5CEC79', '#BEFFBB'],
  ['#4AB35A', '#FFD932', '#F9B300', '#F68800'],
  ['#F35847', '#FF9186', '#F1454D', '#D81F2C'],
];

export default name => {
  const i = asciiSum(name.substring(0, name.length / 2)) % colors.length;
  const j =
    asciiSum(name.substring(name.length / 2, name.length)) % colors[0].length;
  return colors[i][j];
};
