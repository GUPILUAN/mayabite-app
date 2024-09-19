export const themeColors = {
  text: "#f97316",
  bgColor: (opacity) => `rgba(251, 146, 60, ${opacity})`,
  starsColor: (number) => {
    if (number < 2.5) {
      return "#af0f0c";
    } else if (number > 2.5 && number < 4) {
      return "#c4b008";
    } else {
      return "#36ad0a";
    }
  },
};
