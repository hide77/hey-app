const asciiSum = str => {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum;
};

const colors = [
  [['#B24592', '#F15F79'], ['#D38312', '#A83279'], ['#00D2FF', '#3A7BD5' ], ['#00C6FF', '#0072FF'], ['#F2709C', '#FF9472'], ['#7A2EF7', '#F26DB3']],
  [['#56F1D1', '#4385FF'], ['#E95638', '#E4224E'], ['#FFAFBD', '#FFC3A0'], ['#9D50BB', '#6E48AA'], ['#43CEA2', '#185A9D' ], ['#2C3E50', '#2980B9']],
  [['#E53EA4', '#8E2BEF' ], ['#FC00FF', '#00DBDE'], ['#FF5F6D', '#FFC371'], ['#F17756', '#FF436B'], ['#2767F4', '#55DDD3'], ['#F2994A', '#F2C94C']],
  [['#283C86', '#45A247'], ['#2767F4', '#55DDD3'], ['#FF4E50', '#F9D423' ], ['#556270', '#FF6B6B'], ['#DE6262', '#FFB88C'], ['#3494E6', '#EC6EAD']],
  [['#159957', '#155799'], ['#76B852', '#8DC26F'], ['#56CCF2', '#2F80ED'], ['#2767F4', '#55DDD3'], ['#606C88', '#3F4C6B' ], ['#EECDA3', '#EF629F']],
  [['#007991', '#78FFD6'], ['#4568DC', '#B06AB3'], ['#DCE35B', '#45B649'], ['#7A2EF7', '#F26DB3'], ['#F857A6', '#FF5858'], ['#B993D6', '#8CA6DB' ]],
];

export default name => {
  const i = asciiSum(name.substring(0, name.length / 2)) % colors.length;
  const j =
    asciiSum(name.substring(name.length / 2, name.length)) % colors[0].length;
  return colors[i][j];
};
