const componentArr = [
  "Avatar",
  "Icon",
  "Pagination",
  "ImageLoader",
  "Empty",
  "Carousel",
  "ImageHover",
  "CarouselItem"
];
let testComponents = [];
componentArr.forEach((item) => {
  testComponents.push({
    path: `/${item}`,
    name: `${item}`,
    component: () => import(`@/components/${item}/test.vue`),
  });
});

export default testComponents;
