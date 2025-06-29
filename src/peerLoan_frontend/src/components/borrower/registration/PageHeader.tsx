
import React from 'react';
import { motion } from 'framer-motion';

const PageHeader: React.FC = () => {
  return (
    <div className="text-center mb-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
        Student Borrower Registration
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Register as a student borrower to access loans with competitive rates backed by the security of blockchain technology.
      </p>
    </div>
  );
};

export default PageHeader;
