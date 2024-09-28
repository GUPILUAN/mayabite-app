export const themeColors = {
  text: "#f97316",
  bgColor: (opacity) => `rgba(249,139,5, ${opacity})`,
  bgColorGradient: (opacity) =>
    `linear-gradient(45deg, rgba(249,139,5,${opacity}) 33%, rgba(251,179,13,${opacity}) 66%)`,
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
