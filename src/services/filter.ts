export const filterIt = (arr: any, searchKey: string) => {
  return arr.filter((obj: { [x: string]: string | string[] }) =>
    Object.keys(obj).some((key) =>
      JSON.stringify(obj[key]).toLowerCase().includes(searchKey.toLowerCase())
    )
  );
};

export const sortByKey = (arr: any, key: string) => {
  return arr.sort(dynamicSort(key));
};

function dynamicSort(property: string) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substring(1);
  }
  return function (a: any, b: any) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}
