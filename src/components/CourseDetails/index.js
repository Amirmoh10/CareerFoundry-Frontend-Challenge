import { useEffect, useState } from "react";

import { request, getCurrencyPrice, formatDate } from "../../utils";
import { REQUEST, COURSES_URL } from "../../constants";
import FeedbackMessage from "../FeedbackMessage";
import styles from "./CourseDetails.module.css";

export default function CourseDetails({ selectedCourseSlug, userInfo }) {
  const [courseDetails, setCourseDetails] = useState();
  const [requestStatus, setRequestStatus] = useState(REQUEST.DEFAULT);

  const { prices, start_dates } = courseDetails ?? {};
  const [nextStartDate, ...futureStartDates] = start_dates ?? [];

  const coursePrice = getCurrencyPrice(prices, userInfo?.location?.is_eu);
  const courseNextStartDate = formatDate(nextStartDate);
  const courseFutureStartDates = futureStartDates
    .map((startDate) => formatDate(startDate))
    .join(" | ");

  const newCourseDetailsObj = {
    Price: coursePrice,
    "Next Start Date": courseNextStartDate,
    "Future Start Dates": courseFutureStartDates,
  };

  useEffect(() => {
    async function getCourseDetails() {
      try {
        setRequestStatus(REQUEST.LOADING);
        const course = await request(`${COURSES_URL}/${selectedCourseSlug}`);
        setRequestStatus(REQUEST.SUCCESS);
        setCourseDetails(course);
      } catch (error) {
        setRequestStatus(REQUEST.ERROR);
        console.log(error);
      }
    }

    getCourseDetails();
  }, [selectedCourseSlug]);

  const isDataReady = ![REQUEST.LOADING, REQUEST.ERROR].includes(requestStatus);

  const courseDetailsElement = (
    <div className={styles.courseDetailsWrapper}>
      {Object.entries(newCourseDetailsObj).map(([key, value]) => (
        <div key={key} className={styles.courseDetails}>
          <h4>{key}</h4>
          <p>{value}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.courseDetailsSection}>
      {!isDataReady ? (
        <FeedbackMessage requestStatus={requestStatus} />
      ) : (
        requestStatus === REQUEST.SUCCESS && courseDetailsElement
      )}
    </div>
  );
}
