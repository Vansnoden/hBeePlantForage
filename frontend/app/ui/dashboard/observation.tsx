import { Observation } from '@/app/lib/definitions';
import { lusitana } from '../fonts';


export function ObservationItem(props:{ obs:Observation }) {
  return (
    <div className={`${lusitana.className} grid grid-cols-2`}>
        <div>
            <b>Site Name</b><br/>
            <b>Plant Specie Name</b><br/>
            <b>Source</b><br/>
            <b>Year</b><br/>
        </div>
        <div>
            <span>{props.obs.site_id}</span><br/>
            <span>{props.obs.plant_specie_id}</span><br/>
            <span>{props.obs.source}</span><br/>
            <span>{props.obs.year}</span><br/>
        </div>
    </div>
  );
}