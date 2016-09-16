all: public/europe.json

build/ne_110m_admin_0_countries.zip:
	mkdir -p $(dir $@)
	curl -o $@ http://www.naturalearthdata.com/download/110m/cultural/$(notdir $@)

build/ne_110m_admin_0_countries.shp: build/ne_110m_admin_0_countries.zip
	unzip -od $(dir $@) $<
	touch $@

build/2015_CPI_DataMethodologyZIP.zip:
	mkdir -p $(dir $@)
	curl -o $@ http://files.transparency.org/content/download/1950/12812/file/$(notdir $@)

build/CPI_2015_data.xlsx: build/2015_CPI_DataMethodologyZIP.zip
	unzip -od $(dir $@) $<
	mv 'build/Data & methodology/Data/CPI 2015_data.xlsx' $@
	rm -r 'build/Data & methodology/'
	touch $@

build/countries.json: build/ne_110m_admin_0_countries.shp
	rm -f $@
	ogr2ogr -f GeoJSON -where "CONTINENT IN ('EUROPE') OR ADM0_A3 IN ('LBY', 'DZA', 'TUN', 'MAR', 'EGY', \
	                                                                  'CYN', 'CYP', 'TUR', 'GEO', 'ARM', 'AZE', \
																																		'KAZ', 'SYR', 'IRQ', 'IRN', 'KWT', \
																																		'LBN', 'ISR', 'PSX', 'JOR', 'SAU', 'TKM')" $@ $<

refdata: refdata/europe_country_doc.csv refdata/europe_party_doc.csv refdata/europe_election_doc.csv \
	refdata/view_election.csv refdata/view_party.csv refdata/view_cabinet.csv

refdata/europe_country_doc.csv:
	wget --no-check-certificate --output-document=$@ \
	'https://docs.google.com/spreadsheet/ccc?key=1RimXeWViJSy4iddNDweCWkDfh2kB2j8xzcoVvJmFIC8&gid=0&output=csv'

refdata/europe_party_doc.csv:
	wget --no-check-certificate --output-document=$@ \
	'https://docs.google.com/spreadsheet/ccc?key=1RimXeWViJSy4iddNDweCWkDfh2kB2j8xzcoVvJmFIC8&gid=768641176&output=csv'

refdata/europe_election_doc.csv:
	wget --no-check-certificate --output-document=$@ \
	'https://docs.google.com/spreadsheet/ccc?key=1RimXeWViJSy4iddNDweCWkDfh2kB2j8xzcoVvJmFIC8&gid=2122577684&output=csv'

refdata/view_election.csv:
	wget --no-check-certificate --output-document=$@ \
	'http://www.parlgov.org/static/data/development-utf-8/view_election.csv'

refdata/view_party.csv:
	wget --no-check-certificate --output-document=$@ \
	'http://www.parlgov.org/static/data/development-utf-8/view_party.csv'

refdata/view_cabinet.csv:
	wget --no-check-certificate --output-document=$@ \
	'http://www.parlgov.org/static/data/development-utf-8/view_cabinet.csv'

public/europe.json: build/countries.json refdata/europe_country_doc.csv
	topojson -o $@ --id-property 'adm0_a3,countryCode' \
	--external-properties refdata/europe_country_doc.csv \
	--properties population=+population \
	--properties gdpMillionUsd=+gdpMillionUsd \
	--properties corruptionIndex=+corruptionIndex \
	--properties systemOfGovernment=systemOfGovernment \
	--properties continent=continent \
	--properties name=name_long -- $<
