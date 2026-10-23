import '../styles/components/Button.css'

function Button({
  variant = "primary",
  type = "button",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn${variant[0].toUpperCase()}${variant.slice(1)} ${className}`}
      {...props}
    />
  );
}

export default Button;
