package biz.shujutech.o2rm;

import biz.shujutech.base.App;
import biz.shujutech.base.Connection;
import biz.shujutech.base.Hinderance;
import biz.shujutech.db.object.ObjectBase;
import biz.shujutech.db.relational.BaseDb;
import biz.shujutech.db.relational.Database;
import biz.shujutech.db.relational.Database.DbType;
import biz.shujutech.db.relational.Field;
import biz.shujutech.db.relational.FieldType;
import biz.shujutech.db.relational.Record;
import biz.shujutech.db.relational.Table;
import biz.shujutech.util.Generic;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;

public class MalaysiaTaxCalculator {
	private static final String TAX_TABLE = Table.PREFIX_NON_ORM + "malaysia_tax";

	public final static int WAGE_FROM = 0;
	public final static int WAGE_TO = 2;
	public final static int UNMARRIED = 3;

	public final static int SPOUSE_NOWORK_KID0 = 4;
	public final static int SPOUSE_NOWORK_KID1 = 5;
	public final static int SPOUSE_NOWORK_KID2 = 6;
	public final static int SPOUSE_NOWORK_KID3 = 7;
	public final static int SPOUSE_NOWORK_KID4 = 8;
	public final static int SPOUSE_NOWORK_KID5 = 9;
	public final static int SPOUSE_NOWORK_KID6 = 10;
	public final static int SPOUSE_NOWORK_KID7 = 11;
	public final static int SPOUSE_NOWORK_KID8 = 12;
	public final static int SPOUSE_NOWORK_KID9 = 13;
	public final static int SPOUSE_NOWORK_KID10 = 14;
	public final static int SPOUSE_WORK_KID0 = 15;
	public final static int SPOUSE_WORK_KID1 = 16;
	public final static int SPOUSE_WORK_KID2 = 17;
	public final static int SPOUSE_WORK_KID3 = 18;
	public final static int SPOUSE_WORK_KID4 = 19;
	public final static int SPOUSE_WORK_KID5 = 20;
	public final static int SPOUSE_WORK_KID6 = 21;
	public final static int SPOUSE_WORK_KID7 = 22;
	public final static int SPOUSE_WORK_KID8 = 23;
	public final static int SPOUSE_WORK_KID9 = 24;
	public final static int SPOUSE_WORK_KID10 = 25;

	public final static int SPOUSE_NOWORK_KID11 = 3;
	public final static int SPOUSE_NOWORK_KID12 = 4;
	public final static int SPOUSE_NOWORK_KID13 = 5;
	public final static int SPOUSE_NOWORK_KID14 = 6;
	public final static int SPOUSE_NOWORK_KID15 = 7;
	public final static int SPOUSE_NOWORK_KID16 = 8;
	public final static int SPOUSE_NOWORK_KID17 = 9;
	public final static int SPOUSE_NOWORK_KID18 = 10;
	public final static int SPOUSE_NOWORK_KID19 = 11;
	public final static int SPOUSE_NOWORK_KID20 = 12;
	public final static int SPOUSE_WORK_KID11 = 13;
	public final static int SPOUSE_WORK_KID12 = 14;
	public final static int SPOUSE_WORK_KID13 = 15;
	public final static int SPOUSE_WORK_KID14 = 16;
	public final static int SPOUSE_WORK_KID15 = 17;
	public final static int SPOUSE_WORK_KID16 = 18;
	public final static int SPOUSE_WORK_KID17 = 19;
	public final static int SPOUSE_WORK_KID18 = 20; 
	public final static int SPOUSE_WORK_KID19 = 21;
	public final static int SPOUSE_WORK_KID20 = 22;

	public static final int MAX_PREVIOUS_TAX_TABLE_YEAR = 1;

	public static Money GetTaxAmount(Connection aConn, String aYear, SalarySlip aPayslip, final Money aEmployeeEpf, Marital aMarital, Boolean aSpouseWorking, int aTotalKid) throws Exception {
		Money taxableAmount = GetTaxableAmount(aConn, aPayslip);
		// taxableAmount.minusAmount(aEmployeeEpf); // this will be minus by the "Affect Tax" flag, set to true in SalarySlipMalaysia.createEpfTrx
		return(GetTaxAmount(aConn, aYear, taxableAmount, aEmployeeEpf, aMarital, aSpouseWorking, aTotalKid, 0));
	}

	public static Money GetTaxableAmount(Connection aConn, SalarySlip aPayslip) throws Exception {
		return(SalarySlipMalaysia.GetAffectedAmount(aConn, aPayslip, SalarySlipMalaysia.AFFECT_TAX));
	}

	public static Integer GetMinWage(Connection aConn, String aYear) throws Exception {
		Integer result = null;
		String strSql;
		if (Database.GetDbType(aConn) == DbType.MYSQL) {
			strSql = "select min(cast(wage_from as unsigned)) as wage_from from " + TAX_TABLE 
			+ " where cast(year as unsigned) = " + aYear;
		} else {
			throw new Hinderance("Unsupported DB type whilst getting the MIN wage bracket for malaysia tax rate");
		}
		Table tblTaxMin = new Table((ObjectBase) aConn.getBaseDb(), TAX_TABLE);
		tblTaxMin.createField("WAGE_FROM", FieldType.STRING, 32);
		tblTaxMin.fetch(aConn, strSql);
		if (tblTaxMin.getRecord(0) != null) {
			String minWage = tblTaxMin.getRecord(0).getField("WAGE_FROM").getValueStr();
			if (Generic.IsNumber(minWage)) {
				result = Integer.parseInt(minWage);
			}
		}
		return(result);
	}

	public static Table FetchMaxWage(Connection aConn, String aYear, String aFieldAmount) throws Exception {
		Table tblTaxMax;
		String strSql;
		if (Database.GetDbType(aConn) == DbType.MYSQL) {
			strSql = "select year, wage_from, wage_to, " + aFieldAmount
			+ " from " + TAX_TABLE + " where year = " + aYear 
			+ " and cast(wage_to as unsigned) = (select max(cast(wage_to as unsigned)) from " + TAX_TABLE + " where year = " + aYear + ")";
		} else {
			throw new Hinderance("Unsupported DB type whilst getting the MAX wage bracke for malaysia tax rate");
		}
		tblTaxMax = new Table((ObjectBase) aConn.getBaseDb(), TAX_TABLE);
		tblTaxMax.createField("YEAR", FieldType.STRING, 32);
		tblTaxMax.createField("WAGE_FROM", FieldType.STRING, 32);
		tblTaxMax.createField("WAGE_TO", FieldType.STRING, 32);
		tblTaxMax.createField(aFieldAmount, FieldType.STRING, 32);
		tblTaxMax.fetch(aConn, strSql);
		return(tblTaxMax);
	}

	public static Integer GetMaxWage(Connection aConn, Record aPcbRecord, String aYear) throws Exception {
		Integer result = null;
		if (aPcbRecord != null) {
			String strMaxWage = aPcbRecord.getField("WAGE_TO").getValueStr();
			if (Generic.IsNumber(strMaxWage)) {
				result = Integer.parseInt(strMaxWage);
			}
		} else {
			App.logWarn(MalaysiaTaxCalculator.class, "Fail to get the maximum tax bracket for year: " + aYear);
		}
		return(result);
	}

	public static Money GetTaxAmount(Connection aConn, String aYear, Money aTaxableAmount, final Money aEmployeeEpf, Marital aMarital, Boolean aSpouseWorking, int aTotalKid, Integer aRecursiveDepth) throws Exception {
		if (Database.TableExist(aConn, TAX_TABLE) == false) {
//			throw new Hinderance("Tax table is missing: " + TAX_TABLE); // we will not allow this to run since it's taking too long time so just throw and let user knows
		}

		String fieldAmount;
		if (aMarital.getDescr().equals(Marital.Single.getDescr())) {
			fieldAmount = "UNMARRIED";
		} else {
			fieldAmount = "SPOUSE";
			if (aSpouseWorking) {
				fieldAmount += "_WORK_KID";
			} else {
				fieldAmount += "_NOWORK_KID";
			}
			fieldAmount += aTotalKid;
		}

		Money amountToDeduct = (Money) ObjectBase.CreateObject(aConn, Money.class);

		Double dblWage = aTaxableAmount.getValueDouble();
		Integer intWage = dblWage.intValue();

		Integer minWage = GetMinWage(aConn, aYear);
		if (minWage == null || intWage >= minWage) {
			String strSql;

			if (Database.GetDbType(aConn) == DbType.MYSQL) {
				strSql = "select year, wage_from, wage_to, " + fieldAmount
				+ " from " + TAX_TABLE
				+ " where cast(wage_from as unsigned) <= " + intWage
				+ " and cast(wage_to as unsigned) >= " + intWage
				+ " and year = " + aYear;
			} else {
				throw new Hinderance("Unsupported DB type whilst calculating Malaysia tax rate");
			}

			Table tblTaxAmount = new Table((ObjectBase) aConn.getBaseDb(), TAX_TABLE);
			tblTaxAmount.createField("YEAR", FieldType.STRING, 32);
			tblTaxAmount.createField("WAGE_FROM", FieldType.STRING, 32);
			tblTaxAmount.createField("WAGE_TO", FieldType.STRING, 32);
			tblTaxAmount.createField(fieldAmount, FieldType.STRING, 32);
			tblTaxAmount.fetch(aConn, strSql);

			if (tblTaxAmount.getRecord(0) != null) {
				String strAmount = tblTaxAmount.getRecord(0).getField(fieldAmount).getValueStr();
				if (Generic.IsNumber(strAmount) == false) {
					strAmount = "0.00";
					App.logWarn(MalaysiaTaxCalculator.class, "Invalid number in field: " + TAX_TABLE + "." + fieldAmount + ", assume 0 value");
				} 
				amountToDeduct.setValue(aTaxableAmount.getCurrencyCode(), strAmount);
			} else {
				Table tblTaxMax = FetchMaxWage(aConn, aYear, fieldAmount);
				Integer maxWage = GetMaxWage(aConn, tblTaxMax.getRecord(0), aYear);
				if (maxWage != null && intWage > maxWage) {
					/*
					App.logWarn(MalaysiaTaxCalculator.class, "Using max wage earner from: " + TAX_TABLE + ", year: " + aYear + ", wage to: " + intWage);
					String strMaxTax = tblTaxMax.getRecord(0).getField(fieldAmount).getValueStr();
					amountToDeduct.setValue(aBasicSalary.getCurrencyCode(), strMaxTax);
					*/
					throw new Hinderance("Wage above: " + maxWage + ", requires tax calculation currently not supported, contact support");
				} else {
					if (aRecursiveDepth >= MAX_PREVIOUS_TAX_TABLE_YEAR) {
						throw new Hinderance("Cannot find PCB for current and prior year, table: " + TAX_TABLE + ", year: " + aYear + ", wage from: " + intWage);
					} else {
						App.logWarn(MalaysiaTaxCalculator.class, "Fail to find PCB entry in table: " + TAX_TABLE + ", year: " + aYear + ", wage from: " + intWage + ", using previous year");
						int intYear = Integer.parseInt(aYear) - 1;
						aRecursiveDepth++;
						amountToDeduct = GetTaxAmount(aConn, String.valueOf(intYear), aTaxableAmount, aEmployeeEpf, aMarital, aSpouseWorking, aTotalKid, aRecursiveDepth);
					}
				}
			}
		} else {
			amountToDeduct.setValue(aTaxableAmount.getCurrencyCode(), "0.00");
		}

		return(amountToDeduct);
	}

	public static void CreateField(Record record, String aFieldName, String[] aryStr, int aIdx) throws Exception {
		Field fieldStr = record.createField(aFieldName, FieldType.STRING, 32); 
		fieldStr.setValueStr(aryStr[aIdx]);
	}

	public static void CreateTaxTable(Connection aConn) throws Exception {
		ObjectBase dbMaster = ((ObjectBase) aConn.getBaseDb());
		Table tblTaxSchedule = new Table(dbMaster, TAX_TABLE);
		if (dbMaster.tableExist(aConn, TAX_TABLE) == true) {
			throw new Hinderance("Tax table already exist: " + TAX_TABLE); // we will not allow this to run since it's taking too long time so just throw and let user knows
		} else {
			App.logInfo(MalaysiaTaxCalculator.class, "Creating table: " + TAX_TABLE);
			tblTaxSchedule.createField("YEAR", FieldType.STRING, 32);
			tblTaxSchedule.createField("WAGE_FROM", FieldType.STRING, 32);
			tblTaxSchedule.createField("WAGE_TO", FieldType.STRING, 32);
			tblTaxSchedule.createField("UNMARRIED", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_NOWORK_KID0", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_NOWORK_KID1", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_NOWORK_KID2", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_NOWORK_KID3", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_NOWORK_KID4", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_NOWORK_KID5", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_NOWORK_KID6", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_NOWORK_KID7", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_NOWORK_KID8", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_NOWORK_KID9", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_NOWORK_KID10", FieldType.STRING, 32);

			tblTaxSchedule.createField("SPOUSE_NOWORK_KID11", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_NOWORK_KID12", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_NOWORK_KID13", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_NOWORK_KID14", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_NOWORK_KID15", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_NOWORK_KID16", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_NOWORK_KID17", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_NOWORK_KID18", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_NOWORK_KID19", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_NOWORK_KID20", FieldType.STRING, 32);

			tblTaxSchedule.createField("SPOUSE_WORK_KID0", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_WORK_KID1", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_WORK_KID2", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_WORK_KID3", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_WORK_KID4", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_WORK_KID5", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_WORK_KID6", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_WORK_KID7", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_WORK_KID8", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_WORK_KID9", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_WORK_KID10", FieldType.STRING, 32);

			tblTaxSchedule.createField("SPOUSE_WORK_KID11", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_WORK_KID12", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_WORK_KID13", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_WORK_KID14", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_WORK_KID15", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_WORK_KID16", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_WORK_KID17", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_WORK_KID18", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_WORK_KID19", FieldType.STRING, 32);
			tblTaxSchedule.createField("SPOUSE_WORK_KID20", FieldType.STRING, 32);

			dbMaster.createTable(aConn, tblTaxSchedule);
			App.logInfo(MalaysiaTaxCalculator.class, "Created table:  " + TAX_TABLE);
		}
	}

	public static void InsertTaxTable(Connection aConn, String aYear) throws Exception {
		App.logInfo(MalaysiaTaxCalculator.class, "Inserting tax record, this will take few minutes...");
		String urlPath = MalaysiaTaxCalculator.class.getClassLoader().getResource("resources/" + "MalaysiaTaxSchedule" + aYear + ".txt").getPath();
		InputStream is = new FileInputStream(urlPath); 
		BufferedReader buf = new BufferedReader(new InputStreamReader(is));

		int totalInserted = 0;
		int totalUpdated = 0;
		String line = buf.readLine(); 
		StringBuilder sb = new StringBuilder(); 
		ObjectBase dbMaster = ((ObjectBase) aConn.getBaseDb());
		Table tblTaxSchedule = new Table(dbMaster, TAX_TABLE);

		try {
			while(line != null) { 
				sb.append(line).append("\n"); 
				line = buf.readLine(); 
				if (line == null) continue;

				String[] aryStr = line.split("\\s+");
				if (aryStr[WAGE_FROM].matches("[-+]?\\d*\\.?\\d+") && aryStr[WAGE_TO].matches("[-+]?\\d*\\.?\\d+")) {
					//if (aryStr.length >= 24) {
					if (aryStr.length >= 24) {
						//System.out.println("INSERTING: " + line);
						Record record = new Record();
						//Field fieldStr = record.CreateField("WAGE_FROM", FieldType.STRING, 32); fieldStr.setValueStr(aryStr[WAGE_FROM]);
						record.createField("YEAR", FieldType.STRING, 32).setValueStr(aYear);
						CreateField(record, "WAGE_FROM", aryStr, WAGE_FROM);
						CreateField(record, "WAGE_TO", aryStr, WAGE_TO);
						CreateField(record, "UNMARRIED", aryStr, UNMARRIED);

						CreateField(record, "SPOUSE_NOWORK_KID0", aryStr, SPOUSE_NOWORK_KID0);
						CreateField(record, "SPOUSE_NOWORK_KID1", aryStr, SPOUSE_NOWORK_KID1);
						CreateField(record, "SPOUSE_NOWORK_KID2", aryStr, SPOUSE_NOWORK_KID2);
						CreateField(record, "SPOUSE_NOWORK_KID3", aryStr, SPOUSE_NOWORK_KID3);
						CreateField(record, "SPOUSE_NOWORK_KID4", aryStr, SPOUSE_NOWORK_KID4);
						CreateField(record, "SPOUSE_NOWORK_KID5", aryStr, SPOUSE_NOWORK_KID5);
						CreateField(record, "SPOUSE_NOWORK_KID6", aryStr, SPOUSE_NOWORK_KID6);
						CreateField(record, "SPOUSE_NOWORK_KID7", aryStr, SPOUSE_NOWORK_KID7);
						CreateField(record, "SPOUSE_NOWORK_KID8", aryStr, SPOUSE_NOWORK_KID8);
						CreateField(record, "SPOUSE_NOWORK_KID9", aryStr, SPOUSE_NOWORK_KID9);
						CreateField(record, "SPOUSE_NOWORK_KID10", aryStr, SPOUSE_NOWORK_KID10);


						CreateField(record, "SPOUSE_WORK_KID0", aryStr, SPOUSE_WORK_KID0);
						CreateField(record, "SPOUSE_WORK_KID1", aryStr, SPOUSE_WORK_KID1);
						CreateField(record, "SPOUSE_WORK_KID2", aryStr, SPOUSE_WORK_KID2);
						CreateField(record, "SPOUSE_WORK_KID3", aryStr, SPOUSE_WORK_KID3);
						CreateField(record, "SPOUSE_WORK_KID4", aryStr, SPOUSE_WORK_KID4);
						CreateField(record, "SPOUSE_WORK_KID5", aryStr, SPOUSE_WORK_KID5);
						CreateField(record, "SPOUSE_WORK_KID6", aryStr, SPOUSE_WORK_KID6);
						CreateField(record, "SPOUSE_WORK_KID7", aryStr, SPOUSE_WORK_KID7);
						CreateField(record, "SPOUSE_WORK_KID8", aryStr, SPOUSE_WORK_KID8);
						CreateField(record, "SPOUSE_WORK_KID9", aryStr, SPOUSE_WORK_KID9);
						CreateField(record, "SPOUSE_WORK_KID10", aryStr, SPOUSE_WORK_KID10);

						tblTaxSchedule.insert(aConn, record); 
						totalInserted++;
					} else if (aryStr.length >= 20) {
						//System.out.println("UPDATING: " + line);
						Record record = new Record();
						Record whereRec = new Record();
						whereRec.createField("YEAR", FieldType.STRING, 32).setValueStr(aYear);
						CreateField(whereRec, "WAGE_FROM", aryStr, WAGE_FROM);
						CreateField(whereRec, "WAGE_TO", aryStr, WAGE_TO);

						record.createField("YEAR", FieldType.STRING, 32).setValueStr(aYear);
						CreateField(record, "WAGE_FROM", aryStr, WAGE_FROM);
						CreateField(record, "WAGE_TO", aryStr, WAGE_TO);

						CreateField(record, "SPOUSE_NOWORK_KID11", aryStr, SPOUSE_NOWORK_KID11);
						CreateField(record, "SPOUSE_NOWORK_KID12", aryStr, SPOUSE_NOWORK_KID12);
						CreateField(record, "SPOUSE_NOWORK_KID13", aryStr, SPOUSE_NOWORK_KID13);
						CreateField(record, "SPOUSE_NOWORK_KID14", aryStr, SPOUSE_NOWORK_KID14);
						CreateField(record, "SPOUSE_NOWORK_KID15", aryStr, SPOUSE_NOWORK_KID15);
						CreateField(record, "SPOUSE_NOWORK_KID16", aryStr, SPOUSE_NOWORK_KID16);
						CreateField(record, "SPOUSE_NOWORK_KID17", aryStr, SPOUSE_NOWORK_KID17);
						CreateField(record, "SPOUSE_NOWORK_KID18", aryStr, SPOUSE_NOWORK_KID18);
						CreateField(record, "SPOUSE_NOWORK_KID19", aryStr, SPOUSE_NOWORK_KID19);
						CreateField(record, "SPOUSE_NOWORK_KID20", aryStr, SPOUSE_NOWORK_KID20);

						CreateField(record, "SPOUSE_WORK_KID11", aryStr, SPOUSE_WORK_KID11);
						CreateField(record, "SPOUSE_WORK_KID12", aryStr, SPOUSE_WORK_KID12);
						CreateField(record, "SPOUSE_WORK_KID13", aryStr, SPOUSE_WORK_KID13);
						CreateField(record, "SPOUSE_WORK_KID14", aryStr, SPOUSE_WORK_KID14);
						CreateField(record, "SPOUSE_WORK_KID15", aryStr, SPOUSE_WORK_KID15);
						CreateField(record, "SPOUSE_WORK_KID16", aryStr, SPOUSE_WORK_KID16);
						CreateField(record, "SPOUSE_WORK_KID17", aryStr, SPOUSE_WORK_KID17);
						CreateField(record, "SPOUSE_WORK_KID18", aryStr, SPOUSE_WORK_KID18);
						CreateField(record, "SPOUSE_WORK_KID19", aryStr, SPOUSE_WORK_KID19);
						CreateField(record, "SPOUSE_WORK_KID20", aryStr, SPOUSE_WORK_KID20);

						tblTaxSchedule.update(aConn, record, whereRec);  // we update since before this, this tax bracket have already been populated with KID0 to KID10
						totalUpdated++;
					}
				}
			}
			App.logInfo(MalaysiaTaxCalculator.class, "Inserted a total of : " + totalInserted + ", total updated: " + totalUpdated);
		} catch(Exception ex) {
			throw new Hinderance(ex, "Fail at line no: " + totalInserted + ", data: " + line);
		}
	}

	public static void IndexTaxTable(Connection aConn) throws Exception {
		ObjectBase dbMaster = ((ObjectBase) aConn.getBaseDb());
		Table tblTaxSchedule = new Table(dbMaster, TAX_TABLE);
		Field fieldYear = tblTaxSchedule.createField("YEAR", FieldType.STRING, 32);
		Field fieldWageFrom = tblTaxSchedule.createField("WAGE_FROM", FieldType.STRING, 32);
		fieldYear.setObjectKey(true);
		fieldWageFrom.setObjectKey(true);
		fieldYear.setObjectKeyNo(0);
		fieldWageFrom.setObjectKeyNo(1);
		Database.CreateIndex(aConn, tblTaxSchedule);
		App.logInfo(MalaysiaTaxCalculator.class, "Successfully created index for tax table: " + TAX_TABLE);
	}

	public static void main(String[] argv) throws Exception {
		Connection conn = null;
		ObjectBase dbMaster = null;
		try {
			dbMaster = new ObjectBase();
			String[] args1 = { BaseDb.PROPERTY_LOCATION_APP };
			dbMaster.setupApp(args1);
			dbMaster.setupDb(); // setup connection pooling
			conn = dbMaster.getConnPool().getConnection();

			//CreateTaxTable(conn);
			//InsertTaxTable(conn, "2018"); // make sure all number columsn do not have comma, otherwise need to use replace(col, ',', '') 
			//InsertTaxTable(conn, "2017");
			InsertTaxTable(conn, "2016");
			IndexTaxTable(conn);
		} catch(Exception ex) {
			App.logEror(0, new Hinderance(ex, "Application encounter fatal error, application is aborting...."));
		} finally {
			if (dbMaster != null && conn != null) {
				dbMaster.getConnPool().freeConnection(conn);
			}
		}
	}
}
	