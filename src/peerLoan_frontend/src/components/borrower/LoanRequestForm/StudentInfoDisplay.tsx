
import React from 'react';
import { GraduationCap } from 'lucide-react';

interface StudentInfoDisplayProps {
  studentInfo: any;
}

const StudentInfoDisplay: React.FC<StudentInfoDisplayProps> = ({ studentInfo }) => {
  if (!studentInfo) return null;
  
  const graduationInfo = studentInfo.graduationDate ? 
    new Date(studentInfo.graduationDate).toLocaleDateString() : 
    "Not verified";
    
  return (
    <div className="mb-6 bg-secondary/30 p-4 rounded-lg">
      <h3 className="font-medium flex items-center gap-2 mb-3">
        <GraduationCap className="h-5 w-5 text-adanfo-blue" />
        Verified Student Status
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">University:</p>
          <p className="font-medium">{studentInfo.universityName}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Expected Graduation:</p>
          <p className="font-medium">{graduationInfo}</p>
        </div>
        <div>
          <p className="text-muted-foreground">GPA:</p>
          <p className="font-medium">{studentInfo.gpa.toFixed(1)}/4.0</p>
        </div>
      </div>
    </div>
  );
};

export default StudentInfoDisplay;
