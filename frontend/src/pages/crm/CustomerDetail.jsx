import { useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';

const CustomerDetail = () => {
  const { id } = useParams();

  return (
    <div className="page-container">
      <PageHeader
        title="Customer Details"
        breadcrumbs={[
          { label: 'CRM', path: '/customers' },
          { label: 'Customers', path: '/customers' },
          { label: `Customer #${id}` },
        ]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
          <p className="text-gray-500 text-sm">Full customer details will be implemented in Phase 7</p>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
          <p className="text-gray-500 text-sm">Order history and payment overview</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
