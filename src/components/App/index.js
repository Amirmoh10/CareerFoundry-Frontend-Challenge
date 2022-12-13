import { useEffect, useReducer } from "react";

import { request } from "../../utils";
import {
  REQUEST,
  COURSES_URL,
  USER_LOCATION_URL,
  IPSTACK_KEY,
} from "../../constants";
import CourseDetails from "../CourseDetails";
import Course from "../Course";
import FeedbackMessage from "../FeedbackMessage";
import styles from "./App.module.css";

const initialState = {
  coursesList: [],
  userInfo: [],
  requestStatus: REQUEST.DEFAULT,
  selectedCourseSlug: "",
};

const ACTION = {
  LOADING_SET: "LOADING_SET",
  ERROR_SET: "ERROR_SET",
  DATA_FETCHED: "DATA_FETCHED",
  COURSE_SELECTED: "COURSE_SELECTED",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTION.LOADING_SET:
      return { ...state, requestStatus: REQUEST.LOADING };

    case ACTION.ERROR_SET:
      return { ...state, requestStatus: REQUEST.ERROR };

    case ACTION.DATA_FETCHED: {
      return {
        ...state,
        coursesList: action.updatedCoursesList,
        userInfo: action.updatedUserInfo,
        requestStatus: REQUEST.SUCCESS,
      };
    }

    case ACTION.COURSE_SELECTED: {
      return {
        ...state,
        selectedCourseSlug: action.courseSlug,
      };
    }

    default:
      return state;
  }
}

export default function App() {
  const [
    { coursesList, userInfo, selectedCourseSlug, requestStatus },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    async function getCoursesAndUserInfo() {
      try {
        dispatch({ type: ACTION.LOADING_SET });
        const [courses, mockUser] = await Promise.all([
          request(COURSES_URL),
          request(`${USER_LOCATION_URL}?access_key=${IPSTACK_KEY}`),
        ]);
        dispatch({
          type: ACTION.DATA_FETCHED,
          updatedCoursesList: courses,
          updatedUserInfo: mockUser,
        });
      } catch (error) {
        dispatch({ type: ACTION.ERROR_SET });
      }
    }

    getCoursesAndUserInfo();
  }, []);

  const isDataReady = ![REQUEST.LOADING, REQUEST.ERROR].includes(requestStatus);

  return (
    <div className={styles.App}>
      <div className={styles.coursesHeadingsSection}>
        <div className={styles.headingsWrapper}>
          <h1 className={styles.title}>CareerFoundry Courses</h1>
          <p className={styles.description}>
            Select a course to see more details
          </p>
        </div>
        {!isDataReady ? (
          <FeedbackMessage
            requestStatus={requestStatus}
            testId={
              requestStatus === REQUEST.LOADING
                ? "dataFetchLoading"
                : "dataFetchLoading"
            }
          />
        ) : (
          requestStatus === REQUEST.SUCCESS && (
            <div className={styles.coursesWrapper} data-testid="courses">
              {coursesList.map(({ slug, title }) => (
                <Course
                  key={slug}
                  {...{ slug, title }}
                  onSelect={() =>
                    dispatch({
                      type: ACTION.COURSE_SELECTED,
                      courseSlug: slug,
                    })
                  }
                />
              ))}
            </div>
          )
        )}
      </div>
      {selectedCourseSlug && (
        <CourseDetails
          selectedCourseSlug={selectedCourseSlug}
          userInfo={userInfo}
        />
      )}
    </div>
  );
}
