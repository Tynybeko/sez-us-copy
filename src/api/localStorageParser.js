export const setLocalStorage = (localStorageKey, payload) => {
  let data = JSON.parse(localStorage.getItem(localStorageKey, payload)) || [];

  const createItemObj = (arr) => {
    const itemObj = {};
    if (payload.value) {
      itemObj.requestId = payload.requestId;
      itemObj.email = payload.email;
      itemObj.searchValue = payload.value;
      itemObj.requestName = payload.name;
      itemObj.sortMethod = payload.sort;
      itemObj.maxResult = payload.maxResult;
    } else {
      itemObj.id = payload.id;
      itemObj.userEmail = payload.userEmail;
      itemObj.userPassword = payload.userPassword;
    }
    arr.push(itemObj);
  };
  createItemObj(data);
  localStorage.setItem(localStorageKey, JSON.stringify(data));
};

export const editSavedData = (localStorageKey, payload) => {
  const requestArray = JSON.parse(localStorage.getItem(localStorageKey));
  requestArray.map((obj) => {
    if (obj.requestId === payload.requestId) {
      obj.requestId = payload.requestId;
      obj.email = payload.email;
      obj.searchValue = payload.value;
      obj.requestName = payload.name;
      obj.sortMethod = payload.sort;
      obj.maxResult = payload.maxResult;
    }
  });
  localStorage.setItem("saveRequests", JSON.stringify(requestArray));
};

export const removeSavedRequest = (localStorageKey, id) => {
  const requestArray = JSON.parse(localStorage.getItem(localStorageKey));
  const newList = requestArray.filter((obj) => obj.requestId !== id);
  localStorage.setItem(localStorageKey, JSON.stringify(newList));
};
