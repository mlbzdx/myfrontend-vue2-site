const componentArr = ["Avatar","Icon","Pager"];
let testComponents = [];
componentArr.forEach((item) => {
  testComponents.push({
    path: `/${item}`,
    name: `${item}`,
    component: () => import(`@/components/${item}/test.vue`),
  });
});

export default testComponents;
