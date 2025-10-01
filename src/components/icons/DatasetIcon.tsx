const DatasetIcon = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 9.16691C16.1421 9.16691 19.5 8.04764 19.5 6.66695C19.5 5.28626 16.1421 4.16699 12 4.16699C7.85786 4.16699 4.5 5.28626 4.5 6.66695C4.5 8.04764 7.85786 9.16691 12 9.16691Z"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.5 12.5C19.5 13.8834 16.1666 15 12 15C7.83336 15 4.5 13.8832 4.5 12.5"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.5 6.66602V18.3327C4.5 19.716 7.83336 20.8326 12 20.8326C16.1666 20.8326 19.5 19.7159 19.5 18.3327V6.66602"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default DatasetIcon;
