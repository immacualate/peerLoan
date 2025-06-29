
// Import dependencies for Internet Computer
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Int32 "mo:base/Int32";
import Bool "mo:base/Bool";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Error "mo:base/Error";

actor peerLoan {
  // Type definitions
  type Loan = {
    id : Text;
    borrower : Principal;
    borrowerName : Text;
    lender : ?Principal;
    amount : Float;
    duration : Nat32;
    purpose : Text;
    interestRate : Float;
    monthlyPayment : Float;
    totalRepayment : Float;
    creditScore : Nat32;
    status : Text; // "pending", "active", "repaid", "defaulted"
    createdAt : Text;
    description : Text;
    repaymentSchedule : [RepaymentScheduleItem];
  };

  type RepaymentScheduleItem = {
    dueDate : Text;
    amount : Float;
    isPaid : Bool;
    paidAt : ?Text;
    paidAmount : ?Float;
  };

  type StudentInfo = {
    fullName : ?Text;
    contactNumber : ?Text;
    hashedGhanaCard : ?Text;
    universityName : Text;
    studentId : Text;
    gpa : Float;
    graduationDate : Text;
    isEnrolled : Bool;
  };

  // Storage
  private var nextLoanId : Nat = 1;
  private var loans = HashMap.HashMap<Text, Loan>(0, Text.equal, Text.hash);
  private var userLoans = HashMap.HashMap<Principal, [Text]>(0, Principal.equal, Principal.hash);
  private var verifiedStudents = HashMap.HashMap<Principal, StudentInfo>(0, Principal.equal, Principal.hash);
  private var userCreditScores = HashMap.HashMap<Principal, Nat32>(0, Principal.equal, Principal.hash);

  // Helper functions
  private func generateLoanId() : Text {
    let id = "LOAN-" # Nat.toText(nextLoanId);
    nextLoanId += 1;
    return id;
  };

  private func calculateInterestRate(creditScore : Nat32) : Float {
    if (creditScore >= 750) { return 8.0; }
    else if (creditScore >= 700) { return 10.0; }
    else if (creditScore >= 650) { return 12.0; }
    else if (creditScore >= 600) { return 15.0; }
    else { return 18.0; };
  };

  private func generateRepaymentSchedule(amount : Float, duration : Nat32, interestRate : Float) : [RepaymentScheduleItem] {
    let _now = Time.now();
    let totalInterest = (amount * interestRate * Float.fromInt(Nat32.toNat(duration))) / 100.0;
    let totalAmount = amount + totalInterest;
    let monthlyPayment = totalAmount / Float.fromInt(Nat32.toNat(duration));

    var schedule = Buffer.Buffer<RepaymentScheduleItem>(Nat32.toNat(duration));

    for (i in Iter.range(0, Nat32.toNat(duration) - 1)) {
      let dueDate = /* calculate due date */  "2025-" # Nat.toText(((i + 5) % 12) + 1) # "-15";
      schedule.add({
        dueDate = dueDate;
        amount = monthlyPayment;
        isPaid = false;
        paidAt = null;
        paidAmount = null;
      });
    };

    return Buffer.toArray(schedule);
  };

  // Public functions
  public shared(_msg) func createLoan(borrower : Principal, amount : Float, duration : Nat32, purpose : Text) : async {#Ok : Text; #Err : Text} {
    try {
      // Check if the student is verified
      switch (verifiedStudents.get(borrower)) {
        case (null) { return #Err("Student not verified"); };
        case (_) { /* Student is verified, continue */ };
      };

      // Get the borrower's credit score or set a default
      let creditScore = Option.get(userCreditScores.get(borrower), 650 : Nat32);

      // Calculate interest rate based on credit score
      let interestRate = calculateInterestRate(creditScore);

      // Calculate monthly payment
      let totalInterest = (amount * interestRate * Float.fromInt(Nat32.toNat(duration))) / 100.0;
      let totalAmount = amount + totalInterest;
      let monthlyPayment = totalAmount / Float.fromInt(Nat32.toNat(duration));

      // Generate loan ID
      let loanId = generateLoanId();

      // Create repayment schedule
      let repaymentSchedule = generateRepaymentSchedule(amount, duration, interestRate);

      // Create the loan
      let newLoan : Loan = {
        id = loanId;
        borrower = borrower;
        borrowerName = "Borrower-" # Principal.toText(borrower);
        lender = null;
        amount = amount;
        duration = duration;
        purpose = purpose;
        interestRate = interestRate;
        monthlyPayment = monthlyPayment;
        totalRepayment = totalAmount;
        creditScore = creditScore;
        status = "pending";
        createdAt = /* Get current time in ISO format */ "2025-04-22T00:00:00Z";
        description = "Loan for " # purpose # " requested by a verified student borrower.";
        repaymentSchedule = repaymentSchedule;
      };

      // Save the loan
      loans.put(loanId, newLoan);

      // Update user loans
      switch (userLoans.get(borrower)) {
        case (null) { userLoans.put(borrower, [loanId]); };
        case (?existingLoans) {
          let updatedLoans = Array.append<Text>(existingLoans, [loanId]);
          userLoans.put(borrower, updatedLoans);
        };
      };

      return #Ok(loanId);
    } catch (e) {
      return #Err("Failed to create loan: " # Error.message(e));
    };
  };

  public shared(_msg) func fundLoan(lender : Principal, loanId : Text) : async {#Ok : Bool; #Err : Text} {
    try {
      switch (loans.get(loanId)) {
        case (null) { return #Err("Loan not found"); };
        case (?loan) {
          if (loan.status != "pending") {
            return #Err("Loan is not available for funding");
          };

          // Update the loan with the lender and change status
          let updatedLoan : Loan = {
            loan with
            lender = ?lender;
            status = "active";
          };

          loans.put(loanId, updatedLoan);

          // Update user loans for the lender
          switch (userLoans.get(lender)) {
            case (null) { userLoans.put(lender, [loanId]); };
            case (?existingLoans) {
              let updatedLoans = Array.append<Text>(existingLoans, [loanId]);
              userLoans.put(lender, updatedLoans);
            };
          };

          return #Ok(true);
        };
      };
    } catch (e) {
      return #Err("Failed to fund loan: " # Error.message(e));
    };
  };

  public shared(_msg) func repayLoan(borrower : Principal, loanId : Text, amount : Float) : async {#Ok : {creditScoreChange : Int32}; #Err : Text} {
    try {
      switch (loans.get(loanId)) {
        case (null) { return #Err("Loan not found"); };
        case (?loan) {
          if (Principal.notEqual(loan.borrower, borrower)) {
            return #Err("Not authorized to repay this loan");
          };

          if (loan.status != "active") {
            return #Err("Loan is not active");
          };

          // Find the next unpaid repayment
          var nextUnpaidIndex : Int = -1;
          label findLoop for (i in Iter.range(0, loan.repaymentSchedule.size() - 1)) {
            if (not loan.repaymentSchedule[i].isPaid) {
              nextUnpaidIndex := i;
              break findLoop;
            };
          };

          if (nextUnpaidIndex == -1) {
            return #Err("No pending repayments");
          };

          // Update the repayment
          let now = /* Current time in ISO format */ "2025-04-22T00:00:00Z";
          let unpaidIndex = Int.abs(nextUnpaidIndex);
          var newSchedule = Array.tabulate<RepaymentScheduleItem>(
            loan.repaymentSchedule.size(),
            func (i : Nat) : RepaymentScheduleItem {
              if (i == unpaidIndex) {
                return {
                  dueDate = loan.repaymentSchedule[i].dueDate;
                  amount = loan.repaymentSchedule[i].amount;
                  isPaid = true;
                  paidAt = ?now;
                  paidAmount = ?amount;
                };
              } else {
                return loan.repaymentSchedule[i];
              };
            }
          );

          // Check if all repayments are complete
          let isComplete = Array.foldLeft<RepaymentScheduleItem, Bool>(
            newSchedule,
            true,
            func (acc, item) { acc and item.isPaid }
          );

          // Update the loan
          let updatedStatus = if (isComplete) { "repaid" } else { "active" };
          let updatedLoan : Loan = {
            loan with
            status = updatedStatus;
            repaymentSchedule = newSchedule;
          };

          loans.put(loanId, updatedLoan);

          // Update credit score
          let creditScoreChange : Int32 = 5; // Default value, in a real implementation would depend on payment timing
          let currentScore = Option.get(userCreditScores.get(borrower), 650 : Nat32);
          let newScoreInt = Int32.toInt(Int32.fromNat32(currentScore)) + Int32.toInt(creditScoreChange);
          let newScore = if (newScoreInt < 0) { 0 : Nat32 } else { Int32.toNat32(Int32.fromInt(newScoreInt)) };
          userCreditScores.put(borrower, newScore);

          return #Ok({creditScoreChange = creditScoreChange});
        };
      };
    } catch (e) {
      return #Err("Failed to process repayment: " # Error.message(e));
    };
  };

  public query func getUserLoans(user : Principal) : async [Loan] {
    switch (userLoans.get(user)) {
      case (null) { return []; };
      case (?loanIds) {
        var userLoansList = Buffer.Buffer<Loan>(loanIds.size());
        for (loanId in loanIds.vals()) {
          switch (loans.get(loanId)) {
            case (null) { /* Loan not found, skip */ };
            case (?loan) { userLoansList.add(loan); };
          };
        };
        return Buffer.toArray(userLoansList);
      };
    };
  };

  public query func getPendingLoans() : async [Loan] {
    var pendingLoansList = Buffer.Buffer<Loan>(0);
    
    for ((_, loan) in loans.entries()) {
      if (loan.status == "pending") {
        pendingLoansList.add(loan);
      };
    };
    
    return Buffer.toArray(pendingLoansList);
  };

  public shared(_msg) func verifyStudent(principal : Principal, studentData : StudentInfo) : async {#Ok : Bool; #Err : Text} {
    try {
      // Store verification data
      verifiedStudents.put(principal, studentData);
      
      // Initialize credit score if not already set
      if (Option.isNull(userCreditScores.get(principal))) {
        userCreditScores.put(principal, 650 : Nat32); // Default starting credit score
      };
      
      return #Ok(true);
    } catch (e) {
      return #Err("Failed to verify student: " # Error.message(e));
    };
  };
}