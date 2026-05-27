import { Link } from 'react-router-dom';
import { HiChevronRight } from 'react-icons/hi';

const PageHeader = ({ title, subtitle, breadcrumbs = [], actions }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-sm text-gray-500 mb-1">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-1">
                {index > 0 && <HiChevronRight className="w-3 h-3" />}
                {crumb.path ? (
                  <Link to={crumb.path} className="hover:text-primary-400 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-400">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <h1 className="section-title">{title}</h1>
        {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
      </div>

      {/* Action Buttons */}
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};

export default PageHeader;
