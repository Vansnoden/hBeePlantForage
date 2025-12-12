
COUNTRIES = {
    'afghanistan': 'afg', 'angola': 'ago', 'albania': 'alb', 'u.a.e': 'are', 
    'argentina': 'arg', 'armenia': 'arm', 'antarctica': 'ata', 'french southern and antarctic lands': 'atf', 
    'australia': 'aus', 'austria': 'aut', 'azerbidjan': 'aze', 'burundi': 'bdi', 'belgium': 'bel', 'benin': 'ben', 
    'burkina faso': 'bfa', 'bangladesh': 'bgd', 'bulgaria': 'bgr', 'the bahamas': 'bhs', 
    'bosnia and herzegovina': 'bih', 'belarus': 'blr', 'belize': 'blz', 'bermuda': 'bmu', 'bolivia': 'bol', 
    'brazil': 'bra', 'brunei': 'brn', 'bhutan': 'btn', 'botswana': 'bwa', 'central african republic': 'caf', 
    'canada': 'can', 'switzerland': 'che', 'chile': 'chl', 'china': 'chn', 'ivory coast': 'civ', 'cameroon': 'cmr', 
    'democratic republic of congo': 'cod', 'republic of congo': 'cog', 'colombia': 'col', 'costa rica': 'cri', 
    'kosovo': 'cs-km', 'cuba': 'cub', 'cyprus': 'cyp', 'czechia': 'cze', 'germany': 'deu', 'djibouti': 'dji', 
    'denmark': 'dnk', 'dominican republic': 'dom', 'algeria': 'dza', 'ecuador': 'ecu', 'egypt': 'egy', 'eritrea': 'eri', 
    'western sahara': 'esh', 'spain': 'esp', 'estonia': 'est', 'ethiopia': 'eth', 'finland': 'fin', 'fiji': 'fji', 
    'falkland island': 'flk', 'france': 'fra', 'gabon': 'gab', 'u.k. united kingdom': 'gbr', 'georgia': 'geo', 
    'ghana': 'gha', 'guinea': 'gin', 'gambia': 'gmb', 'guinee bissau': 'gnb', 'equatorial guinea': 'gnq', 'greece': 'grc', 
    'greenland': 'grl', 'guatemala': 'gtm', 'french guiana': 'guf', 'guyana': 'guy', 'honduras': 'hnd', 'croatia': 'hrv', 
    'haiti': 'hti', 'hungary': 'hun', 'indonesia': 'idn', 'india': 'ind', 'ireland': 'irl', 'iran': 'irn', 'iraq': 'irq', 
    'iceland': 'isl', 'israel': 'isr', 'italia': 'ita', 'jamaica': 'jam', 'jordan': 'jor', 'japan': 'jpn', 'kazakhstan': 'kaz', 
    'kenya': 'ken', 'kyrgystan': 'kgz', 'cambodia': 'khm', 'south korea': 'kor', 'kuwait': 'kwt', 'laos': 'lao', 'liban': 'lbn', 
    'liberia': 'lbr', 'lybia': 'lby', 'sri lanka': 'lka', 'lesotho': 'lso', 'lithuania': 'ltu', 'luxembourg': 'lux', 'latvia': 'lva', 
    'morocco': 'mar', 'moldova': 'mda', 'madagascar': 'mdg', 'mexico': 'mex', 'north macedonia': 'mkd', 'mali': 'mli', 'malta': 'mlt', 
    'myanmar': 'mmr', 'montenegro': 'mne', 'mongolia': 'mng', 'mozambic': 'moz', 'mauritnia': 'mrt', 'malawi': 'mwi', 'malaysia': 'mys', 
    'namibia': 'nam', 'new caledonia': 'ncl', 'niger': 'ner', 'nigeria': 'nga', 'nicaragua': 'nic', 'netherland': 'nld', 'norway': 'nor', 
    'nepal': 'npl', 'new zealand': 'nzl', 'oman': 'omn', 'pakistan': 'pak', 'panama': 'pan', 'peru': 'per', 'philippines': 'phl', 
    'papua new guinea': 'png', 'poland': 'pol', 'puerto rico': 'pri', 'north korea': 'prk', 'portugal': 'prt', 'paraguay': 'pry', 
    'west bank': 'pse', 'qatar': 'qat', 'romania': 'rou', 'russia': 'rus', 'rwanda': 'rwa', 'saudi arabia': 'sau', 'sudan': 'sdn', 
    'senegal': 'sen', 'solomon islands': 'slb', 'sierra leone': 'sle', 'el salvador': 'slv', 'somalia': 'som', 'serbia': 'srb', 
    'south sudan': 'ssd', 'suriname': 'sur', 'slovakia': 'svk', 'slovenia': 'svn', 'sweden': 'swe', 'swaziland': 'swz', 
    'syria': 'syr', 'tchad': 'tcd', 'togo': 'tgo', 'thailand': 'tha', 'tajikistan': 'tjk', 'turkmenistan': 'tkm', 'timor-leste': 'tls', 
    'trinidad and tobago': 'tto', 'tunisia': 'tun', 'turkey': 'tur', 'taiwan': 'twn', 'tanzania': 'tza', 'uganda': 'uga', 'ukraine': 'ukr', 
    'uruguay': 'ury', 'usa': 'usa', 'uzbekistan': 'uzb', 'venezuela': 'ven', 'vietman': 'vnm', 'vanuatu': 'vut', 'yemen': 'yem', 
    'south africa': 'zaf', 'zambia': 'zmb', 'zimbabwe': 'zwe'
}


_QUERY_TOP_X_MOST_REPORTED_PLANTS = """
    drop table if exists top_x_plants;
    select count(o.id), o.plant_specie_id into top_x_plants from observations as o
    group by o.plant_specie_id order by count desc;
    select sum(tt.count), ps.name as specie_name, t.name as taxon_name from top_x_plants as tt
    inner join plant_species as ps on ps.id=tt.plant_specie_id
    inner join taxons as t on t.id=ps.taxon_id
    group by ps.name, t.name order by sum desc limit {x}
"""

_QUERY_TOP_X_MOST_REPORTED_PLANTS_FOR_FAMILY = """
    drop table if exists top_x_plants;
    select count(o.id), o.plant_specie_id into top_x_plants from observations as o
    where 
    o.plant_specie_id 
        in (select id from plant_species as ps 
            where 
            family_id in (select id from "family" as f where name='{family_name}'))
    group by o.plant_specie_id order by count desc;
    select sum(tt.count), ps.name as specie_name, t.name as taxon_name from top_x_plants as tt
    inner join plant_species as ps on ps.id=tt.plant_specie_id
    left join taxons as t on t.id=ps.taxon_id
    group by ps.name, t.name order by sum desc limit {x}
"""


_QUERY_OBS_YEARLY_OVERVIEW = """
    select count(id), year from observations where year between {year_start} and {year_end} group by year order by year asc
"""

_QUERY_OBS_YEARLY_OVERVIEW_CONTINENT = """
select count(o.id), o.year from observations as o
inner join sites as s on s.id = o.site_id 
where 
	year between {year_start} and {year_end}
	and s.region ilike '%{continent}%'
group by year order by year asc
"""

_QUERY_MONTHLY_OBS_DISTRO = """
select count(o.id), o.month from observations as o 
inner join sites as s on o.site_id = s.id and region ilike '%{continent}%'
where o.month notnull
group by month order by month asc
"""

_QUERY_PLANT_SUMMARY_DATA = """
    select o.id, s.name as site_name, s.country, ps.name as plant_name, t.name as taxon_name, 
    ps.scientific_name, f.name as family, k.name 
    as kingdom from observations as o
    inner join plant_species as ps on o.plant_specie_id = ps.id 
    inner join sites as s on o.site_id = s.id
    left  join "family"as f on ps.family_id = f.id
    left  join kingdoms as k on ps.kingdom_id = k.id
    left  join taxons as t on ps.taxon_id = t.id
    limit {items_per_page} offset {offset}
    """

_QUERY_COUNT_PLANT_SUMMARY_DATA = """
    select count(*) from (
        select o.id, s.name as site_name, s.country, ps.name as plant_name, t.name as taxon_name, 
        ps.scientific_name, f.name as family, k.name 
        as kingdom from observations as o
        inner join plant_species as ps on o.plant_specie_id = ps.id 
        inner join sites as s on o.site_id = s.id
        left  join "family"as f on ps.family_id = f.id
        left  join kingdoms as k on ps.kingdom_id = k.id
        left  join taxons as t on ps.taxon_id = t.id
        limit {limit})
    """

_QUERY_PLANT_SUMMARY_DATA_FILTERED = """
    select o.id, s.name as site_name, s.country, t.name as plant_name, 
        ps.scientific_name, f.name as family, t.name as taxon, k.name 
        as kingdom from observations as o
        inner join plant_species as ps on o.plant_specie_id = ps.id 
        inner join sites as s on o.site_id = s.id
        left  join "family"as f on ps.family_id = f.id
        left  join kingdoms as k on ps.kingdom_id = k.id
        left  join taxons as t on ps.taxon_id = t.id
        where s.name ilike '{query}' or s.country ilike '{query}' 
            or ps.name ilike '{query}' or f.name ilike '{query}' 
            or k.name ilike '{query}' or t.name ilike '{query}'
        limit {items_per_page} offset {offset}
"""


_QUERY_COUNT_PLANT_SUMMARY_DATA_FILTERED = """
    select count(*) from (
        select o.id, s.name as site_name, s.country, t.name as plant_name, 
        ps.scientific_name, f.name as family, t.name as taxon, k.name 
        as kingdom from observations as o
        inner join plant_species as ps on o.plant_specie_id = ps.id 
        inner join sites as s on o.site_id = s.id
        left  join "family"as f on ps.family_id = f.id
        left  join kingdoms as k on ps.kingdom_id = k.id
        left  join taxons as t on ps.taxon_id = t.id
        where s.name ilike '{query}' or s.country ilike '{query}' 
            or ps.name ilike '{query}' or f.name ilike '{query}' 
            or k.name ilike '{query}' or t.name ilike '{query}'
        limit {limit})
"""

_QUERY_OBS_PER_COUNTRY = """
DROP TABLE IF EXISTS obs_data_2;
select o.id, o.year ,o.site_id, o.plant_specie_id, s.country 
into temp obs_data_2
from observations as o
inner join sites as s on o.site_id=s.id and country <> '';
select count(id),country from obs_data_2 group by country
"""


_QUERY_OBS_PER_REGION = """
DROP TABLE IF EXISTS obs_data_1;
select o.id, o.year ,o.site_id, o.plant_specie_id, s.region 
into temp obs_data_1
from observations as o
inner join sites as s on o.site_id=s.id and s.region <>'';
select count(id),region from obs_data_1 group by region
"""

_QUERY_OBS_PER_FAMILY_PER_COUNTRY = """
select count(o.id), s.country from observations as o
inner join plant_species as ps on ps.id = o.plant_specie_id
inner join "family" as f on f.id = ps.family_id 
inner join sites as s on o.site_id = s.id
where s.country <> '' and f.name ilike '{family_name}'
group by s.country order by count desc 
"""


_QUERY_MAX_OBS_PER_FAMILY_PER_COUNTRY = """
select count(o.id), s.country from observations as o
inner join plant_species as ps on ps.id = o.plant_specie_id
inner join "family" as f on f.id = ps.family_id 
inner join sites as s on o.site_id = s.id
where s.country <> '' and f.name ilike '{family_name}'
group by s.country order by count desc limit 1
"""

_QUERY_FAMILIES = """
select name from family where name ilike '%{search}%' limit 20;
"""


_QUERY_GROUP_OBS_BY_CONTINENT_REGIONS = """
select count(o.id), s.region from observations as o 
inner join sites as s on s.id=o.site_id and s.region ilike '%{continent}%'
group by s.region
"""

_QUERY_SITE_INFO = """
select s.name as site, s.country, ps.name as specie_name, f.name as family, o.specie_class 
as class, o.source, o.year from observations as o, sites as s, plant_species as ps, family as f
where  o.site_id = s.id and o.plant_specie_id = ps.id and ps.family_id = f.id and o.id in {oids}
"""


# SINGLE TABLE MODE ADAPTED QUERIES

QUERY_TOP_X_MOST_REPORTED_PLANTS = """
select count(id), plant_species_name from bee_plant_data 
group by plant_species_name order by count desc limit {x}
"""

QUERY_TOP_X_MOST_REPORTED_PLANTS_CONTINENT = """
select count(id), plant_species_name from bee_plant_data 
where continent ilike '%{cname}%'
group by plant_species_name order by count desc limit {x}
"""

QUERY_TOP_X_MOST_REPORTED_PLANTS_FOR_FAMILY = """
select count(id), plant_species_name from bee_plant_data 
where family_name ilike '%{family_name}%'
group by plant_species_name order by count desc limit {x}
"""

QUERY_TOP_X_MOST_REPORTED_PLANTS_FOR_FAMILY_CONTINENT = """
select count(id), plant_species_name from bee_plant_data 
where continent ilike '%{cname}%'
and family_name ilike '%{family_name}%'
group by plant_species_name order by count desc limit {x}
"""

QUERY_OBS_YEARLY_OVERVIEW = """
    select count(id), year from bee_plant_data 
    where year between {year_start} and {year_end}
    group by year order by year asc
"""

QUERY_OBS_YEARLY_OVERVIEW_CONTINENT = """
select count(id), year from bee_plant_data 
where 
    year between {year_start} and {year_end} 
    and continent ilike '%{continent}%'
group by year order by year asc
"""


QUERY_OBS_YEARLY_OVERVIEW_CONTINENT_FAMILY = """
select count(id), year from bee_plant_data 
where 
    year between {year_start} and {year_end} 
    and continent ilike '%{continent}%'
    and family_name ilike '%{family_name}%'
group by year order by year asc
"""


QUERY_MONTHLY_OBS_DISTRO = """
select count(id), month from bee_plant_data 
where month <> 0 and region ilike '%{continent}%'
group by month order by month asc
"""


QUERY_PLANT_SUMMARY_DATA = """
select id, location_name as site_name, country, plant_species_name as plant_name, family_name as family 
from bee_plant_data  order by country asc limit {items_per_page} offset {offset}
"""


QUERY_COUNT_PLANT_SUMMARY_DATA = """
select count(*) from bee_plant_data
"""


QUERY_PLANT_SUMMARY_DATA_FILTERED = """
select id, location_name as site_name, country, plant_species_name as plant_name, family_name as family from bee_plant_data
where country ilike '%{query}%' 
    or plant_species_name ilike '%{query}%' 
    or family_name ilike '%{query}%' 
    or continent ilike '%{query}%' 
    or location_name ilike '%{query}%'
order by country asc limit {items_per_page} offset {offset}
"""


QUERY_COUNT_PLANT_SUMMARY_DATA_FILTERED = """
select count(*) from bee_plant_data
where country ilike '%{query}%' 
    or plant_species_name ilike '%{query}%' 
    or family_name ilike '%{query}%' 
    or continent ilike '%{query}%' 
    or location_name ilike '%{query}%'
limit {limit};
"""


QUERY_OBS_PER_COUNTRY = """
select count(id), country from bee_plant_data 
group by country order by count desc;
"""


QUERY_OBS_PER_REGION = """
select count(id), region from bee_plant_data 
group by region order by count desc;
"""


QUERY_OBS_PER_FAMILY_PER_COUNTRY = """
select count(id), country from bee_plant_data 
where family_name ilike '{family_name}'
group by country, family_name order by count desc;
"""


QUERY_MAX_OBS_PER_FAMILY_PER_COUNTRY = """
select count(id), country from bee_plant_data 
where family_name ilike '{family_name}'
group by country, family_name order by count desc limit 1;
"""


QUERY_FAMILIES = """
select distinct family_name as name from bee_plant_data 
where family_name ilike '%{search}%' limit 10;
"""


QUERY_GROUP_OBS_BY_CONTINENT_REGIONS = """
select count(id), region from bee_plant_data
where continent ilike '%{continent}%'
and  year between {year_start} and {year_end}
group by region order by count desc;
"""

QUERY_GROUP_OBS_BY_CONTINENT_REGIONS_FAMILY = """
select count(id), region from bee_plant_data
where 
    continent ilike '%{continent}%'
    and  family_name ilike '%{family_name}%'
    and  year between {year_start} and {year_end}
group by region order by count desc;
"""


QUERY_SITE_INFO = """
select id, location_name as site_name, country, 
plant_species_name as specie_name, family_name as family, is_native 
as class, year from bee_plant_data 
where id in {oids};
"""

QUERY_TOTAL_PLANT_SPECIES = """
select count(distinct plant_species_name) from bee_plant_data;
"""

QUERY_TOTAL_SITES = """
select count(distinct location_name) from bee_plant_data;
"""

QUERY_AGGREGATE_SUMMARY_DATA = """
select get_summary_hierarchy();
"""

QUERY_AGGREGATE_SUMMARY_DATA_CONTINENT = """
select get_summary_hierarchy({continent}, {year_start}, {year_end});
"""

QUERY_AGGREGATE_SUMMARY_DATA_CONTINENT_FAMILY = """
select get_summary_hierarchy({continent}, {year_start}, {year_end}, {family_name});
"""


STORE_PROCEDURES = """
create or replace function aggregate_summary_data_optimal()
returns void as
$$
begin
    -- drop & recreate final storage table
    drop table if exists summary_results;

    create table summary_results (
        id bigserial primary key,
        created_at timestamptz default now(),
        continent varchar,
        region varchar,
        country varchar,
        family_name varchar,
        species_name varchar,
        value integer
    );

    -- insert aggregated, flattened species-level data
    insert into summary_results (
        continent, region, country, family_name, species_name, value
    )
    select
        continent,
        region,
        country,
        family_name,
        plant_species_name as species_name,
        count(*) as value
    from bee_plant_data
    group by
        continent,
        region,
        country,
        family_name,
        plant_species_name
    order by
        continent,
        region,
        country,
        family_name,
        plant_species_name;

end
$$ language plpgsql;


create or replace function get_summary_hierarchy(
    param_continent varchar default null,
    param_year_start integer default null,
    param_year_end integer default null,
    param_family_name varchar default null
)
returns jsonb as
$$
declare
    result jsonb;
begin
    with filtered as (
        select
            continent,
            region,
            country,
            family_name,
            plant_species_name as species_name,
            count(*) as value
        from bee_plant_data
        where
            (param_continent is null or continent ilike '%' || param_continent || '%')
            and (param_family_name is null or family_name ilike '%' || param_family_name || '%')
            and (param_year_start is null or year >= param_year_start)
            and (param_year_end is null or year <= param_year_end)
        group by continent, region, country, family_name, plant_species_name
    ),

    family_nodes as (
        select
            continent,
            region,
            country,
            family_name,
            sum(value) as family_value,
            jsonb_agg(jsonb_build_object('name', species_name, 'value', value) order by species_name) as children
        from filtered
        group by continent, region, country, family_name
    ),

    country_nodes as (
        select
            continent,
            region,
            country,
            sum(family_value) as country_value,
            jsonb_agg(jsonb_build_object('name', family_name, 'value', family_value, 'children', children) order by family_name) as children
        from family_nodes
        group by continent, region, country
    ),

    region_nodes as (
        select
            continent,
            region,
            sum(country_value) as region_value,
            jsonb_agg(jsonb_build_object('name', country, 'value', country_value, 'children', children) order by country) as children
        from country_nodes
        group by continent, region
    ),

    continent_nodes as (
        select
            continent,
            jsonb_build_object(
                'name', continent,
                'value', sum(region_value),
                'children', jsonb_agg(jsonb_build_object('name', region, 'value', region_value, 'children', children) order by region)
            ) as node
        from region_nodes
        group by continent
    )

    select jsonb_agg(node order by node->>'name') into result
    from continent_nodes;

    return result;
end
$$ language plpgsql;
"""