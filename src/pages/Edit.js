import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { DiaryStateContext } from "../App";
import DiaryEditor from "../components/DiaryEditor";

const Eidt = () => {
  const [originData, setOriginData] = useState();
  const navigate = useNavigate();
  const { id } = useParams(); //pathvariable 형식으로 url 호출할 때 가져오는 방법

  const diaryList = useContext(DiaryStateContext);

  useEffect(() => {
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `감정 일기장 - ${id}번 일기 수정`;
  }, []);

  useEffect(() => {
    if (diaryList.length >= 1) {
      const targetDiary = diaryList.find(
        (it) => parseInt(it.id) === parseInt(id)
      );

      console.log(targetDiary);

      if (targetDiary) {
        setOriginData(targetDiary);
      } else {
        //target id가 없을 때
        alert("없는 일기입니다.");
        navigate("/", { replace: true });
      }
    }
  }, [id, diaryList]);

  //originData && <DiaryEditor /> : originData가 존재하면 DiaryEditor를 렌더한다는 의미
  return (
    <div>
      {originData && <DiaryEditor isEdit={true} originData={originData} />}
    </div>
  );
};

export default Eidt;
