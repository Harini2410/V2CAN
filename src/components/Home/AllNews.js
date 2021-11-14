import classes from "./AllNews.module.css";
import { NewsList } from "../Helper/FundProviderListHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobeAsia } from "@fortawesome/free-solid-svg-icons";
const AllNews = () => {
  return (
    <div className={classes.allnews}>
      <div className={classes.newsContainer}>
        <div className={classes.newsHeader}>
          <FontAwesomeIcon icon={faGlobeAsia} className={classes.globeIcon} />
          <div className={classes.newsHeaderText}>
            Latest Schemes for Women Entrepreneur
          </div>
        </div>
        {NewsList.map((items) => (
          <div key={items.id} className={classes.news}>
            <a target="_blank" className={classes.newsLink} href={items.link}>
              {items.title}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AllNews;
