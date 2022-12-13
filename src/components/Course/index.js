import styles from "./Course.module.css";

export default function Course({ slug, title, onSelect }) {
  return (
    <div key={slug} className={styles.course}>
      <h5 className={styles.courseTitle}>{title}</h5>
      <button onClick={onSelect}>See course details</button>
    </div>
  );
}
