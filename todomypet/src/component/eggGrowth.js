export default function eggGrowth(petGrade, color) {
  const baseImageUrl = 'https://todomypet.s3.ap-northeast-2.amazonaws.com/';
  const eggImages = {
    BABY: `${baseImageUrl}num1-egg${color ? `-${color}` : ''}.png`,
    CHILDREN: `${baseImageUrl}num2-egg${color ? `-${color}` : ''}.png`,
    TEENAGER: `${baseImageUrl}num3-egg${color ? `-${color}` : ''}.png`,
    ADULT: `${baseImageUrl}num4-egg${color ? `-${color}` : ''}.png`,
  };

  const eggImage = eggImages[petGrade] || `${baseImageUrl}num1-egg.png`;

  return eggImage;
}
