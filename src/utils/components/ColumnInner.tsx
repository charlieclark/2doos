import classNames from "classnames";
import styles from "./ColumnInner.module.scss";

const ColumnInner = ({
  bottomContents,
  outerContents,
  children,
  className,
}: {
  className?: string;
  bottomContents?: React.ReactNode;
  outerContents?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className={classNames(styles.container, className)}>
      {outerContents}
      <div className={styles.scrollContents}>{children}</div>
      {bottomContents && (
        <div className={styles.bottomContents}>{bottomContents}</div>
      )}
    </div>
  );
};

export default ColumnInner;
