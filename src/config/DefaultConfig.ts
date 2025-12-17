export interface AppConfig {
  rosNodeIp: string;
  rosNodePort: number;
}

export const defaultConfig: AppConfig = {
  rosNodeIp: "192.168.10.89",
  rosNodePort: 9090,
};