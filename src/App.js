import "./App.css";
import React, { useEffect, useReducer, useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Edit from "./pages/Edit";
import New from "./pages/New";
import Diary from "./pages/Diary";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";

//COMPONENTS
import RouteTest from "./components/RouteTest";
import MyButton from "./components/MyButton";
import MyHeader from "./components/MyHeader";

const reducer = (state, action) => {
  let newState = [];
  switch (action.type) {
    case "INIT":
      return action.data;
    case "CREATE": {
      newState = [action.data, ...state];
      break;
    }
    case "REMOVE": {
      newState = state.filter((it) => it.id !== action.targetId);
      break;
    }
    case "EDIT": {
      newState = state.map((it) =>
        it.id === action.data.id ? { ...action.data } : it
      );
      break;
    }
    default:
      return state;
  }

  localStorage.setItem("diary", JSON.stringify(newState));
  return newState;
};

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
  const [data, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    //브라우저의 localstorage aPI 사용. key:value 형태로 넣음
    //기본적으로 value는 문자열로 들어감
    // localStorage.setItem("item1", 10);
    // localStorage.setItem("item2", 20);
    // localStorage.setItem("item3", JSON.stringify({ value: 30 }));
    // const item1 = localStorage.getItem("item1");
    // const item2 = localStorage.getItem("item2");
    // const item3 = JSON.parse(localStorage.getItem("item3"));
    // console.log({ item1, item2, item3 });

    const localData = localStorage.getItem("diary");

    if (localData) {
      const diaryList = JSON.parse(localData).sort(
        (a, b) => parseInt(b.id) - parseInt(a.id)
      );
      if (diaryList.length >= 1) {
        dataId.current = parseInt(diaryList[0].id) + 1;
        dispatch({ type: "INIT", data: diaryList });
      }
    }
  }, []);

  const dataId = useRef(0);

  //CREATE
  const onCreate = (date, content, emotion) => {
    dispatch({
      type: "CREATE",
      data: {
        id: dataId.current,
        date: new Date(date).getTime(),
        content,
        emotion,
      },
    });
    dataId.current += 1;
  };

  //REMOVE
  const onRemove = (targetId) => {
    dispatch({ type: "REMOVE", targetId });
  };

  //EDIT
  const onEdit = (targetId, date, content, emotion) => {
    dispatch({
      type: "EDIT",
      data: {
        id: targetId,
        date: new Date(date).getTime(),
        content,
        emotion,
      },
    });
  };

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={{ onCreate, onRemove, onEdit }}>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/new" element={<New />}></Route>
              <Route path="/diary/:id" element={<Diary />}></Route>
              <Route path="/edit/:id" element={<Edit />}></Route>
            </Routes>
            {/* 
        <RouteTest></RouteTest> */}
          </div>
        </BrowserRouter>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
