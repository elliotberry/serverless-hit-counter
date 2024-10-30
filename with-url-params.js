function containsEncodedComponents(x) {
  // ie ?,=,&,/ etc
  return decodeURI(x) !== decodeURIComponent(x);
}
const withURLParams = async req => {
  let url = new URL(req.url);
  let params = new URLSearchParams(url.search);
  //get all params as object
  let paramsObj = {};
  for (let [key, value] of params) {
    paramsObj[key] = containsEncodedComponents(value) ? decodeURIComponent(value) : value;
  }
  req.paramz = paramsObj;
};

export default withURLParams;
