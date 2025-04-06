
const DashboardItem = ({ title, value, subtext, icon, onClick, className = '' }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white shadow-sm rounded-lg p-4 cursor-pointer transition hover:shadow-md ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-600">{title}</h4>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      {subtext && <div className="text-xs text-gray-500 mt-1">{subtext}</div>}
    </div>
  )
}

export default DashboardItem