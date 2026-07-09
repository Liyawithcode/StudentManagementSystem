import React, { useEffect, useState } from 'react';
import Header from '../../components/layout/Header.jsx';
import Table from '../../components/common/Table.jsx';
import ResultChart from '../../components/charts/ResultChart.jsx';
import Loader from '../../components/common/Loader.jsx';
import { examService } from '../../services/examService.js';
import { toast } from '../../utils/toast.js';

export const Result = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await examService.getAllResults();
        setResults(res.results || res || []);
      } catch (err) {
        toast.error('Failed to load exam results');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <div>
      <Header title="Academic Results" subtitle="Track average student scores, GPAs, and grading curves." />

      <div className="grid gap-6 mt-4 flex-responsive" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
        <div className="card">
          <h4 className="mb-4" style={{ fontFamily: 'Outfit', fontWeight: 600 }}>Student Grade Sheet</h4>
          {loading ? (
            <Loader />
          ) : (
            <Table
              headers={['Student Name', 'Exam', 'Marks', 'Grade']}
              data={results}
              renderRow={(res, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 500 }}>{res.studentName || 'John Doe'}</td>
                  <td>{res.examName || 'CS101 Mid-Terms'}</td>
                  <td>{res.marksObtained || 85}</td>
                  <td>
                    <span className="badge badge-success">{res.grade || 'A'}</span>
                  </td>
                </tr>
              )}
            />
          )}
        </div>

        <div className="card">
          <h4 className="mb-4" style={{ fontFamily: 'Outfit', fontWeight: 600 }}>Grade Distribution</h4>
          <ResultChart />
        </div>
      </div>
    </div>
  );
};

export default Result;
