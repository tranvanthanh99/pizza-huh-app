import React from 'react';
import {
  Typography
} from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#1a90ff',
  },
}))(LinearProgress);

// Inspired by the former Facebook spinners.
const useStylesFacebook = makeStyles((theme) => ({
  root: {
    display: "inline",
    position: 'relative',
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  top: {
    color: '#1a90ff',
    animationDuration: '550ms',
    position: 'absolute',
    left: 0,
  },
  circle: {
    strokeLinecap: 'round',
  },
}));

function FacebookCircularProgress(props) {
  const classes = useStylesFacebook();

  return (
    <div className={classes.root}>
      <CircularProgress
        variant="determinate"
        className={classes.bottom}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={40}
        thickness={4}
        {...props}
      />
    </div>
  );
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export default function CustomizedProgressBars(props) {
  const { info } = props
  const classes = useStyles();

  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    setProgress(info.progress)
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 100 : info.progress));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, [info.progress]);
  // console.log(progress)
  return (
    <div className={classes.root} style={{ marginBottom: "1rem" }}>
      <div className="d-flex" style={{ alignItems: "center" }}>
        <Typography variant="subtitle1" className="d-inline mr-2">
          {info.title}
        </Typography>
        {
          progress === 100
            ?
            <span style={{ color: "green" }}>
              Hoàn thành
              <CheckCircleOutlineRoundedIcon />
            </span>
            :
            <>
              {
                progress < 0
                  ?
                  <span style={{ color: "rgba(0, 0, 0, 0.26)" }}>
                    Đang chờ
                  </span>
                  :
                  <FacebookCircularProgress />
              }
            </>
        }
      </div>
      <BorderLinearProgress variant="determinate" value={progress} />
    </div>
  );
}