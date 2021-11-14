import classes from './LoadingSpinner.module.css';

const LoadingSpinner = (props) => {
  return <div className={`${classes.spinner} ${props.className}`} style={props.style}></div>;
}

export default LoadingSpinner;
