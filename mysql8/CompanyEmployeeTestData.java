package biz.shujutech.stems;

import biz.shujutech.web.JsonProcessor;
import biz.shujutech.base.App;
import biz.shujutech.base.Connection;
import biz.shujutech.base.DateAndTime;
import biz.shujutech.base.Hinderance;
import biz.shujutech.db.object.ObjectBase;
import biz.shujutech.db.relational.BaseDb;
import biz.shujutech.o2rm.Addr;
import biz.shujutech.o2rm.AddrTypeOrganization;
import biz.shujutech.o2rm.AddrTypePerson;
import biz.shujutech.o2rm.City;
import biz.shujutech.o2rm.Company;
import biz.shujutech.o2rm.CompanyMalaysia;
import biz.shujutech.o2rm.Country;
import biz.shujutech.o2rm.Duration;
import biz.shujutech.o2rm.EmailTypeOrganization;
import biz.shujutech.o2rm.EmailTypePerson;
import biz.shujutech.o2rm.EmployeeType;
import biz.shujutech.o2rm.Employment;
import biz.shujutech.o2rm.EmploymentMalaysia;
import biz.shujutech.o2rm.Ethnicity;
import biz.shujutech.o2rm.Gender;
import biz.shujutech.o2rm.LeaveType;
import biz.shujutech.o2rm.MalaysiaEpfCalculator;
import biz.shujutech.o2rm.Marital;
import biz.shujutech.o2rm.MobileTypeOrganization;
import biz.shujutech.o2rm.MobileTypePerson;
import biz.shujutech.o2rm.Person;
import biz.shujutech.o2rm.Relationship;
import biz.shujutech.o2rm.Religion;
import biz.shujutech.o2rm.Salary;
import biz.shujutech.o2rm.SalarySlip;
import biz.shujutech.o2rm.State;
import biz.shujutech.o2rm.TelephoneTypeOrganization;
import biz.shujutech.o2rm.TelephoneTypePerson;
import biz.shujutech.o2rm.User;
import biz.shujutech.o2rm.WorkConfigWeek;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Option;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
import org.joda.time.DateTime;

public class CompanyEmployeeTestData {
	//public static final int MAX_EMPLOYEE = 10;
	public static final int MAX_EMPLOYEE = 3;
	public static final int MAX_SALARY_SLIP = 8;

	public static Company CreateTestData(Connection conn, String companyName, String prefixName) throws Exception {
		String batchId = SalarySlip.GenerateBatchId();

		App.logInfo("Checking if there're any previous employee test data....");
		//String alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		for (int cntr = 0; cntr < MAX_EMPLOYEE; cntr++) {
			Person del2Update = (Person) ObjectBase.CreateObject(conn, Person.class); // remove previous Person testing data if exist
			//Character firstChar = alphabet.charAt((new Random()).nextInt(alphabet.length()));
			del2Update.setName(prefixName + cntr + " Silverston");
			if (del2Update.populate(conn)) {
				if (del2Update.deleteCommit(conn)) {
					App.logInfo("Deleted employee: " + prefixName + cntr + " Silverston");
				} else {
					throw new Hinderance("Fail to delete employee: " + prefixName + cntr + " Silverston");
				}
			} else {
				App.logInfo("There is no previous test data of employee: " + prefixName + cntr + " Silverston");
			}
		}
		{
			App.logInfo("With no employee in the company, remove the company");
			CompanyMalaysia remCmpny = (CompanyMalaysia) ObjectBase.CreateObject(conn, CompanyMalaysia.class); // remove previous Company testing data if exist
			remCmpny.setName(companyName);
			if (remCmpny.populate(conn)) {
				if (remCmpny.deleteCommit(conn)) {
					App.logInfo("Deleted the company: " + remCmpny.getName());
				} else {
					throw new Hinderance("Fail to delete company: " + remCmpny.getName());
				}
			} else {
				App.logWarn("Fail to fetch company from database to delete, nothing to delete");
			}
		}

		App.logInfo("Creating the company object");
		CompanyMalaysia company = (CompanyMalaysia) ObjectBase.CreateObject(conn, CompanyMalaysia.class); // remove previous Company testing data if exist
		company.setName(companyName);
		App.logInfo("Created the company object in the memory: " + company.getName());

		// create company address
		company.addAddr(conn, AddrTypeOrganization.Headquarter);
		Addr companyAddr = company.getAddr(conn, AddrTypeOrganization.Headquarter);
		companyAddr.setAddr1("SD-35-6, Jalan Chan Sow Lin");
		companyAddr.setAddr2("Taman Perindustrian Lian");
		companyAddr.setPostalCode("51211");
		companyAddr.setState("Wilayah Perseketuan");
		companyAddr.setCity("Kuala Lumpur");
		companyAddr.setCountry(Country.Malaysia);

		company.setWorkSchedule(WorkConfigWeek.FiveDayWeekSatSun);

		App.logInfo("Starting to create " + MAX_EMPLOYEE + " employee test record....");
		for (int cntrEmployee = 0; cntrEmployee < MAX_EMPLOYEE; cntrEmployee++) {
			App.logInfo("Creating employee record no: " + cntrEmployee);
			//Character firstChar = alphabet.charAt((new Random()).nextInt(alphabet.length()));
			Person employee = (Person) ObjectBase.CreateObject(conn, Person.class);
			employee.setName(prefixName + cntrEmployee + " Silverston");
			employee.setAlias(prefixName + cntrEmployee);
			employee.setBirthDate(new DateTime());
			employee.setGender(Gender.Male);
			employee.setNationality(Country.Malaysia);
			employee.addMalaysiaIc(conn, "47594329458" + cntrEmployee, null);
			//employee.setPassportNo("S184584" + cntrEmployee);
			employee.setMaritalStatus(Marital.Single);
			employee.setEthnic(Ethnicity.Caucasian);
			employee.setReligion(Religion.Christian);
			employee.setNoOfChild(1);

			EmploymentMalaysia jobMsia = (EmploymentMalaysia) ObjectBase.CreateObject(conn, EmploymentMalaysia.class);
			jobMsia.setNewSocsoMember(false);
			jobMsia.setEpfCalculator(MalaysiaEpfCalculator.EpfRegulation);
			if (cntrEmployee % 3 == 0) {
				jobMsia.setDesignation("Software Developer");
			} else if (cntrEmployee % 3 == 1) {
				jobMsia.setDesignation("Chief Executive Officer");
			} else if (cntrEmployee % 3 == 2) {
				jobMsia.setDesignation("Project Manager");
			}

			if (cntrEmployee % 2 == 0) {
				jobMsia.setType(EmployeeType.Contract);
			} else {
				jobMsia.setType(EmployeeType.Permanent);
			}

			jobMsia.setStartDate((DateAndTime.SetZeroTime(new DateTime())).minusDays(cntrEmployee));
			jobMsia.setEmployer(company);

			Salary basicSalary = (Salary) ObjectBase.CreateObject(conn, Salary.class);
			basicSalary.setSalary(conn, Country.Malaysia.getCurrencyCode(), String.valueOf(1000 * cntrEmployee + 900), "25", Duration.Month);
			jobMsia.setSalary(basicSalary);

			// create few payslip into employment 
			if (cntrEmployee % 2 == 0) {
				for (int cntrPay = 0; cntrPay < MAX_SALARY_SLIP; cntrPay++) {
					//DateTime dateOfMonth = DateAndTime.CreateDateTime(2017, month, 1);
					DateTime dateOfMonth = jobMsia.getStartDate().plusDays(cntrPay * (cntrPay + 30));
					DateTime monthStart = DateAndTime.GetMonthStart(dateOfMonth);
					DateTime monthEnd = DateAndTime.GetMonthEnd(dateOfMonth);

					jobMsia.generateSalarySlip(conn, batchId, monthStart, monthEnd, employee);
				}
			}

			String jsJob = JsonProcessor.Object2Json(conn, jobMsia);
			if (cntrEmployee == 0) App.logInfo("Sample Employment json with payslip: " + jsJob);

			employee.addEmployment(conn, jobMsia);

			employee.addEmail(conn, EmailTypePerson.Personal, "stemsstaff@gmail.com");
			employee.addEmail(conn, EmailTypePerson.Work, "stemsstaff@gmail.com");

			// create employee home address
			employee.addAddr(conn, AddrTypePerson.Home);
			Addr homeAddr = employee.getAddr(conn, AddrTypePerson.Home);
			homeAddr.setAddr1("SD-35-6, Jalan Rungkup");
			homeAddr.setAddr2("Taman Uu Lian");
			homeAddr.setPostalCode("51200");
			homeAddr.setState("Wilayah Perseketuan");
			homeAddr.setCity("Kuala Lumpur");
			homeAddr.setCountry(Country.Malaysia);

			// add mobile phone
			employee.addMobilePhone(conn, MobileTypePerson.Personal, Country.Malaysia.getCountryCallingDesc(), Country.Malaysia.getNdc(0).getValueStr(), "16319389");

			// add telephone
			employee.addTelephone(conn, TelephoneTypePerson.Personal, Country.Malaysia.getCountryCallingDesc(), Country.Malaysia.getAreaCode(0).getValueStr(), "62513439");

			company.addEmployee(conn, employee);

			App.logInfo("Added employee record no: " + cntrEmployee + " into company: " + company.getName());
		}

		String jsCompany = JsonProcessor.Object2Json(conn, company);
		App.logInfo("Sample Company json with payslip: " + jsCompany);

		App.logInfo("Persisting company: " + company.getName() + " into the database");
		App.logInfo(company.getDb().getConnPool().getStats());
		company.persistCommit(conn);

		return(company);
	}

	public static void CreateAppUser(Connection conn, String aLoginId, Company company) throws Exception {
		// create application user for this company
		User newUser = (User) ObjectBase.CreateObject(conn, biz.shujutech.o2rm.User.class);
		newUser.setLoginId(aLoginId);
		if (newUser.populate(conn)) {
			App.logInfo("Application user: " + aLoginId + ", already exist, add a new company to it: " + company.getName());
			newUser.addCompany(conn, company);
			newUser.persistCommit(conn);
		} else {
			newUser.addCompany(conn, company);
			newUser.setLoginId(aLoginId);
			newUser.setPassword(aLoginId);
			newUser.persistCommit(conn);
		}
	}

	public static void InitList(Connection aConn) throws Exception {
		Country.InitList(aConn);
		State.InitList(aConn);
		City.InitList(aConn);
		Ethnicity.InitList(aConn);
		Religion.InitList(aConn);
		Marital.InitList(aConn);
		EmployeeType.InitList(aConn);
		Gender.InitList(aConn);
		EmailTypePerson.InitList(aConn);
		EmailTypeOrganization.InitList(aConn);
		LeaveType.InitList(aConn);
		MobileTypePerson.InitList(aConn);
		MobileTypeOrganization.InitList(aConn);
		TelephoneTypePerson.InitList(aConn);
		TelephoneTypeOrganization.InitList(aConn);
		AddrTypePerson.InitList(aConn);
		AddrTypeOrganization.InitList(aConn);
		MalaysiaEpfCalculator.InitList(aConn);
		Duration.InitList(aConn);
		Relationship.InitList(aConn);
		WorkConfigWeek.InitList(aConn);
	}

	public static void main(String[] args) throws Exception {
		ObjectBase objectDb = new ObjectBase();
		Connection conn = null;
		Options options = null;
		try {

			if (true) { // netbeans web project cannot be run with command line arguments, hence setup the db this way
				//String[] args1 = {"C:\\Shujutech\\StApp\\StEMS\\web\\WEB-INF\\config\\shujutechapp.properties"};
				String[] args1 = { BaseDb.PROPERTY_LOCATION_APP };
				objectDb.setupApp(args1);
				objectDb.setupDb();
				conn = objectDb.getConnPool().getConnection();
			} else {
				// setup command line
				CommandLineParser cliParser = new DefaultParser(); // apache cli 
				options = new Options();
				Option optProp = Option.builder("prop").desc("property file to databse setting and etc").hasArg().argName("property file").required(true).build();
				options.addOption(optProp);

				CommandLine cliLine = cliParser.parse(options, args);
				if (cliLine.hasOption(optProp.getOpt())) {
					String strPropFile = cliLine.getOptionValue(optProp.getOpt());
					if (strPropFile.isEmpty()) {
						throw new ParseException("error, no property file name was specify, see usage below:"); // apparently this will never happen, as the parser will ensure there's argument
					}

					App.Setup(strPropFile);
					objectDb.setupDb();
					conn = objectDb.getConnPool().getConnection();
				} else {
					throw new ParseException("error, no property option was specify, see usage below:"); // apparently this will never happen, as the parser will ensure there's argument
				}
			}

			String COMPANY_MASTER = "Shujutech Sdn Bhd";
			String COMPANY_DEMO = "Demo Sdn Bhd";
			String COMPANY_DEMO1 = "Demo1 Sdn Bhd";
			String APP_USER = "stemsuser@gmail.com";
			String APP_USER1 = "stemsstaff@gmail.com";

			CompanyEmployeeTestData.InitList(conn);

			String INIT_SCHEMA = "INIT_SCHEMA";
			String CREATE_DEMO = "CREATE_DEMO";
			String DELETE_DEMO = "DELETE_DEMO";
			String CREATE_DEMO1 = "CREATE_DEMO1";
			String DELETE_DEMO1 = "DELETE_DEMO1";

			String actionType = INIT_SCHEMA;
			//String actionType = DELETE_DEMO;
			//String actionType = CREATE_DEMO;
			//String actionType = DELETE_DEMO1;
			//String actionType = CREATE_DEMO1;

			if (actionType.equals(INIT_SCHEMA)) {
				// this is compulsory
				App.logInfo("Setting up object index for Company.Employee.Name");
				Company.ObjectIndexOnEmployeeName(conn);

				// this is compulsory
				App.logInfo("Setting up object index for Employment.SalarySlip.StartPeriod");
				Employment.ObjectIndexOnSalarySlipStartPeriod(conn);

				Company companyShuju;
				companyShuju = (Company) ObjectBase.CreateObject(conn, biz.shujutech.o2rm.CompanyMalaysia.class);
				companyShuju.setName(COMPANY_MASTER);
				if (companyShuju.populate(conn)) {
					App.logInfo("Company: " + COMPANY_MASTER + ", already exist, will not create it");
				} else {
					App.logInfo("Company: " + COMPANY_MASTER + ", do NOT exist, creating it...");
					companyShuju.persistCommit(conn);
				}

				Company.CreateCompany(conn, EmploymentMalaysia.EPF_NAME, biz.shujutech.o2rm.CompanyMalaysia.class);
				Company.CreateCompany(conn, EmploymentMalaysia.SOCSO_NAME, biz.shujutech.o2rm.CompanyMalaysia.class);
				Company.CreateCompany(conn, EmploymentMalaysia.IRBM_NAME, biz.shujutech.o2rm.CompanyMalaysia.class);
			}

			if (actionType.equals(CREATE_DEMO) || actionType.equals(INIT_SCHEMA)) {
				Company companyDemo = CreateTestData(conn, COMPANY_DEMO, "Demo");
				CreateAppUser(conn, APP_USER, companyDemo);

				Company companyShuju;
				companyShuju = (Company) ObjectBase.CreateObject(conn, biz.shujutech.o2rm.CompanyMalaysia.class);
				companyShuju.setName(COMPANY_MASTER);
				if (companyShuju.populate(conn)) {
					companyShuju.addCustomer(conn, companyDemo);
					companyShuju.persistCommit(conn);
					App.logInfo("Successfully completed created provider company: " + companyShuju.getName());
				} else {
					throw new Hinderance("Company: " + COMPANY_MASTER + ", do NOT exist, need to init the DB first!");
				}
			}

			if (actionType.equals(DELETE_DEMO)) {
				Company companyDemo = (Company) ObjectBase.CreateObject(conn, biz.shujutech.o2rm.CompanyMalaysia.class);
				companyDemo.setName(COMPANY_DEMO);
				if (companyDemo.populate(conn)) {
					App.logInfo("Marking employees for deletion from company: " + COMPANY_DEMO);
					companyDemo.getFieldObjectBox(Company.Employee).resetIterator(); // always do a reset before starting to loop for the objects
					while (companyDemo.getFieldObjectBox(Company.Employee).hasNext(conn)) {
						Person employee = (Person) companyDemo.getFieldObjectBox(Company.Employee).getNext();
						employee.setForDelete(true);
						App.logInfo("Mark for deletion, employee name: " + employee.getName() + ", of company: " + companyDemo.getName());
					}
					//companyDemo.persistCommit(conn); // if to just removing the employee, we pesist it after marking it for deleteCommit

					companyDemo.getFieldObjectBox(Company.Employee).resetIterator(); // always do a reset before starting to loop for the objects
					while (companyDemo.getFieldObjectBox(Company.Employee).hasNext(conn)) {
						Person employee = (Person) companyDemo.getFieldObjectBox(Company.Employee).getNext();
						ObjectBase.DeleteCommit(conn, employee);
						App.logInfo("Deleted employee name: " + employee.getName());
					}

					// remove demo company from the created app user
					User appUser = (User) ObjectBase.CreateObject(conn, biz.shujutech.o2rm.User.class);
					appUser.setLoginId(APP_USER);
					if (appUser.populate(conn)) {
						App.logInfo("Remove company: " + companyDemo.getName() + ", from application user: " + appUser.getLoginId());
						appUser.removeCompany(conn, companyDemo.getName(), companyDemo.getAlias());
						appUser.persistCommit(conn);
					} else {
						throw new Hinderance("The company: " + COMPANY_DEMO + ", do not have application user: " + APP_USER + ", may need database init");
					}

					// remove demo company as shuju customer
					Company companyShuju;
					companyShuju = (Company) ObjectBase.CreateObject(conn, biz.shujutech.o2rm.CompanyMalaysia.class);
					companyShuju.setName(COMPANY_MASTER);
					if (companyShuju.populate(conn)) {
						companyShuju.removeCustomer(conn, companyDemo.getName(), companyDemo.getAlias());
						companyShuju.persistCommit(conn);
						App.logInfo("Successfully remove customer, company: " + COMPANY_MASTER);
					} else {
						throw new Hinderance("Company: " + COMPANY_MASTER + ", do NOT exist, may need database init");
					}

					App.logInfo("Deleting demo company: " + COMPANY_DEMO);
					ObjectBase.DeleteCommit(conn, companyDemo);
					App.logInfo("Successfully delete demo company: " + COMPANY_DEMO + ", and all its employees, it's login user and remove it as Shuju customer");
				} else {
					App.logEror("Company: " + COMPANY_DEMO + ", do NOT exist, nothing to delete...");
				}
			}

			//
			// for testing SECOND company
			//

			if (actionType.equals(CREATE_DEMO1)) {
				Company companyDemo1 = CreateTestData(conn, COMPANY_DEMO1, "Demo1");
				CreateAppUser(conn, APP_USER1, companyDemo1);

				Company companyShuju;
				companyShuju = (Company) ObjectBase.CreateObject(conn, biz.shujutech.o2rm.CompanyMalaysia.class);
				companyShuju.setName(COMPANY_MASTER);
				if (companyShuju.populate(conn)) {
					companyShuju.addCustomer(conn, companyDemo1);
					companyShuju.persistCommit(conn);
					App.logInfo("Successfully completed created demo company: " + companyDemo1.getName());
				} else {
					App.logEror("Company: " + COMPANY_MASTER + ", do NOT exist, need to init the DB first!");
				}
			}

			if (actionType.equals(DELETE_DEMO1)) {
				Company companyDemo1 = (Company) ObjectBase.CreateObject(conn, biz.shujutech.o2rm.CompanyMalaysia.class);
				companyDemo1.setName(COMPANY_DEMO1);
				if (companyDemo1.populate(conn)) {
					App.logInfo("Marking employees for deletion from company: " + COMPANY_DEMO1);
					companyDemo1.getFieldObjectBox(Company.Employee).resetIterator(); // always do a reset before starting to loop for the objects
					while (companyDemo1.getFieldObjectBox(Company.Employee).hasNext(conn)) {
						Person employee = (Person) companyDemo1.getFieldObjectBox(Company.Employee).getNext();
						employee.setForDelete(true);
						App.logInfo("Mark for deletion, employee name: " + employee.getName() + ", of company: " + companyDemo1.getName());
					}
					//companyDemo.persistCommit(conn); // if to just removing the employee, we pesist it after marking it for deleteCommit

					companyDemo1.getFieldObjectBox(Company.Employee).resetIterator(); // always do a reset before starting to loop for the objects
					while (companyDemo1.getFieldObjectBox(Company.Employee).hasNext(conn)) {
						Person employee = (Person) companyDemo1.getFieldObjectBox(Company.Employee).getNext();
						ObjectBase.DeleteCommit(conn, employee);
						App.logInfo("Deleted employee name: " + employee.getName());
					}

					// remove demo company from the created app user
					User appUser = (User) ObjectBase.CreateObject(conn, biz.shujutech.o2rm.User.class);
					appUser.setLoginId(APP_USER);
					if (appUser.populate(conn)) {
						App.logInfo("Remove company: " + companyDemo1.getName() + ", from application user: " + appUser.getLoginId());
						appUser.removeCompany(conn, companyDemo1.getName(), companyDemo1.getAlias());
						appUser.persistCommit(conn);
					} else {
						throw new Hinderance("The company: " + COMPANY_DEMO1 + ", do not have application user: " + APP_USER + ", may need database init");
					}

					// remove demo company as shuju customer
					Company companyShuju;
					companyShuju = (Company) ObjectBase.CreateObject(conn, biz.shujutech.o2rm.CompanyMalaysia.class);
					companyShuju.setName(COMPANY_MASTER);
					if (companyShuju.populate(conn)) {
						companyShuju.removeCustomer(conn, companyDemo1.getName(), companyDemo1.getAlias());
						companyShuju.persistCommit(conn);
						App.logInfo("Successfully remove customer, company: " + COMPANY_MASTER);
					} else {
						throw new Hinderance("Company: " + COMPANY_MASTER + ", do NOT exist, may need database init");
					}

					App.logInfo("Deleting demo company: " + COMPANY_DEMO1);
					ObjectBase.DeleteCommit(conn, companyDemo1);
					App.logInfo("Successfully delete demo company: " + COMPANY_DEMO1 + ", and all its employees, it's login user and remove it as Shuju customer");
				} else {
					App.logEror("Company: " + COMPANY_DEMO1 + ", do NOT exist, nothing to delete...");
				}
			}

		} catch (Exception ex) {
			if (ex instanceof ParseException && options != null) {
				HelpFormatter formatter = new HelpFormatter();
				App.logEror(0, ex.getMessage());
				formatter.setWidth(255);
				formatter.printHelp("java -jar EmpMgmtSys CompanyEmployeeTestData [-option <option> <argument>]...", options); // should print to string and uses logEror, but HelpFormatter don't seem to be able to print to string
			} else {
				App.logEror(0, new Hinderance(ex, "Application encounter fatal error, application is aborting...."));
			}
		} finally {
			if (conn != null) {
				objectDb.getConnPool().freeConnection(conn);
			}
		}		

		try {
		} catch (Exception ex) {
			App.logEror(ex, "Application is aborting..........");
		}
	}

}