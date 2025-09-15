const DealIcon = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 14.7378H18V5.73779H5.22912C3.99804 5.73779 3 6.73583 3 7.96691V14.7378Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 14.7378V19.2624H18.7254C19.9817 19.2624 21 18.244 21 16.9878V8.73779H18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default DealIcon;
