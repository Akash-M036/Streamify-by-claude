import React from 'react';

const SkeletonCard = () => (
  <div className="skeleton">
    <div className="skeleton-thumb" />
    <div className="skeleton-body">
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
      <div className="skeleton-line short" style={{ width: '40%' }} />
    </div>
  </div>
);

const SkeletonGrid = ({ count = 8 }) => (
  <div className="loading-grid">
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

export default SkeletonGrid;
