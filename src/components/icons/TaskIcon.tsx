const TaskIcon = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9.08337 11.6664L11.5835 14.1664L19.9167 5.83301"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.0834 12.5V18.3333C19.0834 19.2538 18.3372 20 17.4167 20H5.75005C4.82953 20 4.08337 19.2538 4.08337 18.3333V6.66668C4.08337 5.74616 4.82953 5 5.75005 5H14.9167"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default TaskIcon;
