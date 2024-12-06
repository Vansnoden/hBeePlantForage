
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


QUERY_TOP_10_MOST_REPORTED_PLANTS = """
    select count(o.id), o.plant_specie_id , ps.name as plant_name
    from observations as o
    inner join plant_species as ps on o.plant_specie_id = ps.id
    group by o.plant_specie_id, ps.name order by count desc limit 10
"""

QUERY_OBS_YEARLY_OVERVIEW = """
    select count(id), year from observations where year between {year_start} and {year_end} group by year order by year asc
"""

QUERY_MONTHLY_OBS_DISTRO = """
select count(id), month from observations where month notnull group by month order by month asc
"""

QUERY_PLANT_SUMMARY_DATA = """
    select o.id, s.name as site_name, s.country, ps.name as plant_name, 
    ps.scientific_name, f.name as family, t.name as taxon, k.name 
    as kingdom from observations as o
    inner join plant_species as ps on o.plant_specie_id = ps.id 
    inner join sites as s on o.site_id = s.id
    left  join "family"as f on ps.family_id = f.id
    left  join kingdoms as k on ps.kingdom_id = k.id
    left  join taxons as t on ps.taxon_id = t.id
    limit {items_per_page} offset {offset}
    """

QUERY_COUNT_PLANT_SUMMARY_DATA = """
    select count(*) from (
        select o.id, s.name as site_name, s.country, ps.name as plant_name, 
        ps.scientific_name, f.name as family, t.name as taxon, k.name 
        as kingdom from observations as o
        inner join plant_species as ps on o.plant_specie_id = ps.id 
        inner join sites as s on o.site_id = s.id
        left  join "family"as f on ps.family_id = f.id
        left  join kingdoms as k on ps.kingdom_id = k.id
        left  join taxons as t on ps.taxon_id = t.id
        limit {limit})
    """

QUERY_PLANT_SUMMARY_DATA_FILTERED = """
    select o.id, s.name as site_name, s.country, ps.name as plant_name, 
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


QUERY_COUNT_PLANT_SUMMARY_DATA_FILTERED = """
    select count(*) from (
        select o.id, s.name as site_name, s.country, ps.name as plant_name, 
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

QUERY_OBS_PER_COUNTRY = """
DROP TABLE IF EXISTS obs_data_2;
select o.id, o.year ,o.site_id, o.plant_specie_id, s.country 
into temp obs_data_2
from observations as o
inner join sites as s on o.site_id=s.id and country <> '';
select count(id),country from obs_data_2 group by country
"""


QUERY_OBS_PER_REGION = """
DROP TABLE IF EXISTS obs_data_1;
select o.id, o.year ,o.site_id, o.plant_specie_id, s.region 
into temp obs_data_1
from observations as o
inner join sites as s on o.site_id=s.id and s.region <>'';
select count(id),region from obs_data_1 group by region
"""

QUERY_OBS_PER_FAMILY_PER_COUNTRY = """
select count(o.id),o.plant_specie_id ,o.site_id, ps."name" as plant_specie, f.name as family, s.country from observations as o
inner join plant_species as ps on ps.id = o.plant_specie_id
inner join "family" as f on f.id = ps.family_id 
inner join sites as s on o.site_id = s.id
where s.country <> '' and f.name ilike '{family_name}'
group by plant_specie_id,site_id,ps."name",f.name,s.country order by count desc 
"""


QUERY_MAX_OBS_PER_FAMILY_PER_COUNTRY = """
select count(o.id),o.plant_specie_id ,o.site_id, ps."name" as plant_specie, f.name as family, s.country from observations as o
inner join plant_species as ps on ps.id = o.plant_specie_id
inner join "family" as f on f.id = ps.family_id 
inner join sites as s on o.site_id = s.id
where s.country <> '' and f.name ilike '{family_name}'
group by plant_specie_id,site_id,ps."name",f.name,s.country order by count desc limit 1
"""

