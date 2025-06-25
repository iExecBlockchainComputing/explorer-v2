const TransactionIcon = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M6.75 15.4536H15V17.9456C15 18.4582 15.6013 18.7347 15.9905 18.4011L19.7185 13.4112C19.9979 13.1718 19.9979 12.7395 19.7185 12.5H9"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.2499 9.45306H8.99994V7.05426C8.99994 6.54162 8.39862 6.26514 8.00946 6.59874L4.28142 11.5887C4.00206 11.8281 4.00206 12.2603 4.28142 12.4999H14.9999"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default TransactionIcon;
